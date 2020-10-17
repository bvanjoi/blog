# 搞懂 script 标签中 defer 和 async

在 [HTML 中异步加载JS 文件](../HTML中异步加载JS文件/README.md), 我们介绍了通过 defer 和 async 来异步加载 script 标签，进而消除被阻塞的 JavaScript, 这篇文章中，我们简单介绍其使用与异同。

## 介绍

- async: 如果是普通脚本带有 async, 则普通脚本会被并行请求，并尽快解析和执行；如果是模块脚本带有 async 属性，那么脚本以及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并被尽快解析和执行。因此，async 属于无序执行，如果 js 前后存在依赖性，则不建议使用该属性。
- defer: 该属性用来通知脚本将在 文档解析后，触发 DOMContentLoaded 事件前执行。

## 示例

假设在同级目录下，有三个文件：

- `index1.js`:

```javascript
const b1 = document.querySelector('.b1');
console.log('b1',b1);
```

- `index2.js`:

```javascript
console.log('b1 in index2.js',b1); // 创建 index1.js 和 index2.js 的依赖关系
```

### 同步加载时候

剩下一个 HTML 模版，首先展示的是同步加载时的情况：

- `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="./index1.js"></script>
  <script src="./index2.js"></script>
</head>
<body>
  <button class="b1">test1</button>
</body>
</html>
```

其输出为：

![同步加载时](https://img-blog.csdnimg.cn/20201016102705530.png)

### 异步加载时

只关注 script 标签两行：

- 当 引入 index1.js 的 script 标签为 defer 时，效果为：

```html
<script src="./index1.js" defer></script>
<script src="./index2.js"></script>
```

![引入index1.js的script标签为defer时](https://img-blog.csdnimg.cn/20201016103019669.png)

此时，由于 defer 属性， 引入 index1.js 的 script 标签被等到 文档解析 后再加载，所以 index1.js 中的内容可以正常打印，而由于 index2.js 中同步加载，因此此时没有声明 `b1` 变量，进而报错。

- 当引入 index1.js 的 script 标签为 async 时，效果为：

```html
<script src="./index1.js" async></script>
<script src="./index2.js"></script>
```

![引入index1.js的script标签为async时](https://img-blog.csdnimg.cn/20201016103532510.png)

借助上图，我们可以看出 async 与 defer 的不同。

此时，由于 async 属性，引入 index1.js 的 script 标签虽异步加载，但由于其被尽快执行，由于其代码较少，导致加载时间过快，所以被加载好之后马上执行，而此时html文档还加载好，所以 `b1` 为 null, 在 index2.js 中，存在 `b1` 变量，但也为 null.

如果此时，我们将 index.js 内容改为如下：

```js
setTimeout(() => {
  const b1 = document.querySelector('.b1')
  console.log('b1', b1);
}, 0);
```

效果就变成与 *当 引入 index1.js 的 script 标签为 defer 时*一样。

- 两个均为 defer 时，即：

```html
<script src="./index1.js" defer></script>
<script src="./index2.js" defer></script>
```

效果为：

![两个标签均为defer](https://img-blog.csdnimg.cn/20201016104803957.png)

此时，defer 属性让二标签异步执行，且由于 defer 后依旧是按照**原顺序**执行的，所以效果符合预期。

- 两个均为 async 时，即：

```html
<script src="./index1.js" async></script>
<script src="./index2.js" async></script>
```

此时，效果与 *两个均为 defer 时*效果相同，这是因为两个标签均在 DOM 解析后开始执行，且 引入 index1.js 的 script 优先于 引入 index2.js 的标签。

- index1.js 为 defer, index2.js 为 async 时，

即：

```html
<script src="./index1.js" defer></script>
<script src="./index2.js" async></script>
```

此时，效果与 *两个均为 defer 时*效果相同。

- index1.js 为 async, index2.js 为 defer 时，

即：

```html
<script src="./index1.js" async></script>
<script src="./index2.js" defer></script>
```

此时，效果与 *两个均为 defer 时*效果相同。

## 额外的考虑：如果一个标签内同时含有 async 与 defer 会怎样

即：

```html
<script src="./index.js" async defer></script>
```

此时，可以遵循以下规则：

- 如果 async 为 true,那么脚本在下载完成后异步执行。
- 如果 async 为 false, defer 为 true, 那么脚本会在页面解析完毕之后执行。
- 如果 async 和 defer 都为 false, 那么脚本会在页面解析中，停止页面解析，立刻下载并且执行（即同步执行）。
