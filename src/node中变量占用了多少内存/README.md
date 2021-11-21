# node 中变量占用了多少内存

node 项目中，经常会遇到内存泄漏的问题，这种情况下，我们需要查看某个变量在 JavaScript 虚拟机占用的内存空间来定位问题。

本文，将从内存泄漏开始讲起，再来介绍查看变量占据内存空间的工具。

## node 内查看当前内存使用情况

通过函数 `process.memoryUsage` 可以查看当前内存使用情况：

```javascript
console.log(process.memoryUsage())
```

其结果为一个对象：

```javascript
{
  // 单位：字节
  // 进程占用内存量
  rss: 19795968,
  // v8 内存总量
  heapTotal: 4476928,
  // v8 内存使用量
  heapUsed: 2697240,
  // 绑定到 v8 管理的 JavaScript 对象的 C++ 对象的内存使用量
  external: 861246,
  // `ArrayBuffer` 和 `SharedArrayBuffer` 的内存量
  // 包含于 `external` 中
  arrayBuffers: 9898
}
```

## 什么是内存泄漏

内存泄漏可以定义为：一些无用的变量被其他对象引用，导致该无用变量占据的内存空间得不到释放。

例如：

```javascript
console.log('init: ', process.memoryUsage())
const a = new Array(2e7);
console.log('after new array: ', process.memoryUsage());
```

![内存占用情况](https://img-blog.csdnimg.cn/b9977fca67784d1596fa49f20d5c6c40.png)

> 1. 为更清晰的表达，上述 `memoryUsage()` 的输出进行了美化处理。
>
> 2. 通过计算 153 MB / 2e7 = 8 Byte 可以推断中一个 `undefined` 变量在 v8 中占据 64 位（不保证正确）

在上述示例中，变量 `a` 未曾被使用，但是由于其指向常数组，导致这块内存无法被回收，这就相当于发生了内存泄漏。

## 手动执行内存回收

通过执行 `node --expose-gc` 可以将垃圾回收函数 `gc` 暴露到 `global` 上，例如：

```javascript
console.log('init: ', process.memoryUsage())
let a = new Array(2e7);
console.log('after new array: ', process.memoryUsage());
gc();
console.log('after first gc: ', process.memoryUsage());
a = undefined;
gc();
console.log('after second gc: ', process.memoryUsage());
```

![内存占用情况](https://img-blog.csdnimg.cn/31baf73f8d4d423285d1f5553573b648.png)

从 `first gc` 和 `second gc` 后的输出结果来看，在本次任务队列中，只有将引用移除后，才能执行垃圾回收。

因此，这也是别写诸如 `a = 1` 语法的原因，因为它会将变量挂到 `window` 或者 `global` 上，进而导致内存泄漏。

## 查看变量占据的内存空间

下面回归正题：当 node 服务执行时，如何查看某个变量占据了多少内存空间？

### 方法一：lldb 查看内存快照

当程序因异常而崩溃时，操作系统会将程序当时的内存状态记录下来，这就是 Core Dump, 即内存快照，该快照中还保存了异常发生时的寄存器、处理器等信息。

Linux 下，可以通过 `ulimit -c` 来查看允许 Core Dump 生成的文件大小，若其值为 0 表示关闭了 Core Dump, 可以通过 `ulimit -c unlimited` 来暂时开启。

随后，通过 `gcore pid` 指令生成相应的 core dump 文件，最后再通过 `lldb` 来查看 core 文件。

另外，也可以通过 `node --abort-on-uncaught-exception` 当使得 node 程序崩溃时，自动 Core Dump.

### 方式二：通过 `v8.getHeapSnapShot()`

node 内的 v8 库暴露了很多有用的函数，例如之前提到的 [coverage](../工作总结/从测试覆盖率到开源库的PR.md), 这次要介绍 `getHeapSnapShot`.

例如以下代码：

```javascript
const fs = require('fs');
const v8 = require('v8');

function createHeapSnapshot() {
  const snapshotStream = v8.getHeapSnapshot();
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `${Date.now()}.heapsnapshot`;
  const fileStream = fs.createWriteStream(fileName);
  snapshotStream.pipe(fileStream);
}

var_take_up_memory = new Array(1e7);
var_take_up_memory.fill(1)

createHeapSnapshot()
```

执行后会生成后缀为 `heapsnapshot` 的文件，将其放到 chrome devtools - memory - load 中进行加载，其结果为：

![memory 分析](https://img-blog.csdnimg.cn/672132e7c8a243b783d49931a6deea18.png)

可以看到 `var_take_up_memory` 几乎占据了全部内存空间。

其中：

1. Shallow Size 指浅层大小，即自身所占空间大小，不包括引用对象；
2. Retained Size 自身和其引用的对象大小，即该对象被 GC 后可释放的内存大小。
