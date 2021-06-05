# webpack 解析 css

由于 webpack 只能识别 JavaScript 和 JSON 文件，为了将项目中的样式文件生效，需要引入相应的 loaders 来使得样式文件被 webpack 识别为模块。

本文就介绍如何引入 css 文件，进而介绍 webpack loader 的用法。

## 前置知识

- `entry`, `output`, `mode`, `loader` 等核心概念。
- `webpack.config.js` 配置文件的用法。

以上内容，在 [webpack 核心概念](../webpack核心概念/README.md) 均有提及。

## 若直接引入 css 文件

假设存在脚本 `index.js`:

```js
document.write('<p>hello world</p>')
```

其功能为：在页面中增加一行 `hello world` 字段。

如果希望该字段为红色，则应该写成：

```js
import './style.css';
document.write('<p>hello world</p>')
```

同级目录下的 `style.css` 内容为：

```css
p {
  color: red;
}
```

随后，进行 `webpack.config.js` 的编写：

```js
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development'
}
```

之后，便可以执行打包：`npx webpack`. 其执行结果为：

![没有 loader 导致失败](https://img-blog.csdnimg.cn/20210604165300477.png)

> 上图告知我们：需要为其引入合适的 loader

## css-loader 与 style-loader

首先，需要安装两个库：

```bash
yarn add -D css-loader style-loader
```

- `css-loader`: 用于加载 .css 文件，将其转化为 commonjs 对象；
- `style-loader`: 将 css 通过 style 标签注入到 head 中。

在 `webpack.config.js` 的 `module.exports` 中添加以下内容：

```js
// module 用来处理不同类模块
module: {
  // 规则数组
  rules: [
    {
      // 正则语法检测需要处理的文件
      test: /\.css$/,
      // **从右到左**依次调用，
      // 即先通过 css-loader 处理 css 文件，
      // 随后将产物进行 style-loader 处理
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

最终 `webpack.config.js` 的内容为：

![](https://img-blog.csdnimg.cn/20210604171821926.png)

随后，再次执行 `npx webpack`, 运行结果为：

![成功的打包](https://img-blog.csdnimg.cn/2021060417191210.png)

最终，在 dist/bundle 中，可以看到 css-loader 和 style-loader 的处理产物：

![bundle.js 的产物](https://img-blog.csdnimg.cn/20210604172251959.png)

## 使用打包产物

新建 `index.html`, 在其中引入打包产物即可：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>loader-learn</title>
</head>
<body>
  <script src="./dist/bundle.js"></script>
</body>
</html>
```

用浏览器打开，可见其结果为：

![](https://img-blog.csdnimg.cn/20210604172503235.png)
