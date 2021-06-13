# webpack 模块机制

在 [JavaScript 模块化发展](../../JavaScript模块化发展/README.md#IIFE:使用闭包来实现变量私有化) 中，介绍了打包工具是如何使用立即执行函数和闭包来实现变量私有化。

本文将通过最简单的例子，来观察 webpack 打包产物是否满足这一思想。

首先，文件目录结构为：

```txt
|- index.js
|- lib.js
|- index.html
|- webpack.config.js
```

其中：

- `lib.js` 为：

```js
export function add(a,b) {
  return a + b;
}
```

- `index.js` 为：

```js
import {add} from './lib';
console.log(add(1,2));
```

- `index.html` 为：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <script src="./dist"></script>
</body>
</html>
```

- `webpack.config.js` 为：

```js
module.exports = {
  return {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    mode: 'development',
  }
}
```

执行 `npx webpack` 打包的结果为：

![webpack 打包产物结构](https://img-blog.csdnimg.cn/20210609114618424.png)

## webpack 打包产物结构分析

整体为：`(() => {})()`, 它是一个立即执行函数，负责在加载完 script 后执行该内容，同时将模块放到函数作用域内。

随后，`__webpack__modules__` 中包含了  `index.js` 和 `lib.js` 两个 module.

在 `index.js` 下的 eval 部分，有下面一段：

![index.js 打包结果](https://img-blog.csdnimg.cn/20210609114932196.png)

借此可以看到，`index.js` 通过 `webpack_require` 加载了 `lib`.

再往下，`__webpack_module_cache__` 为缓存文件，本文代码太少，该部分完全用不上。

再往下，`__webpack_require__` 这便是 webpack 内部首先的模块机制：

![__webpack_require__ 的实现](https://img-blog.csdnimg.cn/20210609115324609.png)

require 中，先读缓存，如果存在缓存，则直接使用，否则执行创建模块。

再往下，是几段立即执行函数，为 `__webpack_require__` 能力的扩展。

最后，便是执行入口文件：`__webpack_require__('./index.js')`.

## 总结

上述为最简单的打包产物，管中窥豹，可以看到它是创建了自己的一套模块机制，然后从 entry 开始执行代码。
