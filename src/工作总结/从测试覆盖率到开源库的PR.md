# 从测试覆盖率到开源库的 PR

大约九月底，我接手一个小需求：为项目增加测试覆盖率。

## 测试覆盖率是什么

首先，先简单介绍一下什么是测试覆盖率。

比如仓库内有以下代码：

```javascript
// lib.js
function add(a,b) {
  return a + b;
}

function sub(a,b) {
  return a - b
}

module.exports = {add, sub}
```

有测试文件如下：

```javascript
// lib.test.js
const assert = require('assert');
const { add } = require('./lib');

it('coverage', () => {
  assert.deepEqual(add(1,2), 3);
})
```

上述测试文件的覆盖率如下图，红字表示未被覆盖到的代码。

![覆盖率示例](https://img-blog.csdnimg.cn/22102382b3734dc88c5b9f417b891fb5.png)

## 我的任务

我的任务就是给项目增加一个覆盖率测试，其实，思路与实现都很简单，测试框架都带有覆盖率工具，例如：

- Jest 中，添加参数 `--coverage` 即可生成覆盖率；
- Mocha 中，结合 nyc 使用可以生成覆盖率（我们的项目也是使用了 Mocha）

听起来很简单对吧？

当很快就遇到了问题：项目的产物太大了，使用 nyc 时直接内存溢出。

> 64位机器的默认环境下，单个 node 进程的被分配有 1.4Gb 内存。

针对上述问题，我们尝试了以下方法：

## 方法一：从源码开始进行覆盖率测试

该方法思路很明确：当执行覆盖率测试时，不再用打包产物，而是使用源码。其过程类比如下：

```txt
              打包产物
xxx.test.js -----------> result

              源码
xxx.test.js ---------> result
```

这里可以简单列举下优缺点：

1. 产物是一个 js 文件，node 即可执行，因此比较方便，但问题比较明显：产物太大，可能发生内存溢出；
2. 源码是 ts 文件，测试时需要使用 register 转换为 js, 再交给 node 执行；该方法虽然节省了内存空间，但是工程上存在问题，例如工程代码需要对齐到 register.

为此，该方法被舍弃。

## 方法二：对打包产物进行拆分

该方法思路也很明确：既然产物过大，那么就拆分它，其预期效果类似于：

```txt
  拆分前             拆分后
dist.js 100mb  |  a.js 1mb
                  b.js 1mb
                  c.js 1mb
                  d.js 1mb
                  ....
```

看起来符合预期，但由于我们的项目中依赖了一些模块，造成了如下效果：

```txt
  拆分前             拆分后
dist.js 100mb  |  a.js 1mb
                  b.js 1mb
                  c.js 90mb
                  ....
```

其中，`c.js` 依然过大，依旧会造成 OOM. 而又由于现实问题，很难在短时间内将其拆分，因此该方法又被舍弃。

## 方法三：使用 V8 coverage

就在我焦头烂额之时，技术负责人发给我两份资料：

- [v8 javascript code coverage](https://v8.dev/blog/javascript-code-coverage)
- [c8](https://github.com/bcoe/c8)

上述两份资料是指：V8 原生地支持了 JavaScript 覆盖率（即从 cpp 的层面进行了支持）。

该方法思路也很明确：既然 JavaScript 有性能问题，那咱们直接使用 V8 吧。

随后，经过我实验认证，该方法确实解决了性能问题：直接对产物进行覆盖率测试不会 stack overflow.

但依然存在问题：`c8` 依赖 `v8-to-istanbul` 的库，而该库对代码进行 source-map 转换时，缺失一定的功能，例如对 `node_modules` 的移除、`sourcesContent` 不存在的兜底等等。

实在没办法了，既然它不支持这些功能，我们就给他补上，于是，我们 fork 了一个分支，按需增加一些代码，最终解决了问题。

## 我的第一个 PR

项目的需求解决后，我将对 `v8-to-istanbul` 的修改进行了提交：<https://github.com/istanbuljs/v8-to-istanbul/pull/168>, 这也是我第一次对开源库进行代码修改。
