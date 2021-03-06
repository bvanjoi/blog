# Webpack 从头学

## Webpack 核心概念

一言概之，Webpack 是用来打包 JavaScript 代码的工具。

首先，需要了解一些基本概念：

- Entry: 入口配置，表明 webpack 以哪个文件开始打包；在 webpack 配置文件中，`entry` 字段即可以是一个字符串，也可以是一个对象，也可以是一个数组。
  - string: 单入口，以 entry 为入口打包。此处 chunk 默认为 `main`.
  - array: 多入口，强制处理某些不相关的文件。此时，所有文件只会生成一个 chunk( 以第一个元素为 ) 和 一个 bundle.
  - object: 多入口/单入口，entry 字段的最完整的配置。
- Output: 打包产物配置，告知 webpack 生成打包产物的目录、打包产物文件名等；
- Loaders: 默认情况下，webpack 只能处理 JavaScript 和 JSON 文件，通过配置 Loaders, 可以使得 webpack 处理其他类型（诸如 css, txt）等格式的文件；
- Plugins: Loaders 为 webpack 增加了处理其他文件的能力，而 Plugins 提供的能力更为广泛，例如打包产物优化、资源管理、注入环境变量等；
- Mode: webpack 提供 `none`, `development`, `production` 三种打包模式，不同选项可以启动不同的优化效果。默认情况下为 UglifyJsPlugin`production`. 除了 `none` 模式外，其余二者都会带有一系列内置 plugin.
- Browser Compatibility： webpack 兼容所有实现 ES5 的浏览器，对于更古老的浏览器，需要引入 polyfill.

## 打包初体验

首先，需要安装两个库：

```bash
yarn add -D webpack webpack-cli
```

- `-D` 表明将依赖记录到 `devDependence` 字段下，表明为开发阶段使用到的依赖。事实上，诸如 Babel, Webpack 等工程相关的依赖，大多属于开发环境下的依赖；
- `webpack`: webpack 的核心运行程序；
- `webpack-cli`: webpack 的命令行工具。

随后，创建一个名为 `index.js` 的 JavaScript 脚本，其内容为：

```js
const add = (a, b) => {
  return a + b
}

console.log(add(1,2))
```

随后，在命令行输入：

```bash
npx webpack --entry ./index.js --output-path ./dist --output-filename bundle.js --mode=development
```

- `--entry ./index.js`: 指出入口文件为当前目录下的 `index.js`.
- `--output-path ./dist`: 指出存放打包产物的文件夹为当前目录下 `dist`.
- `--output-filename bundle.js`: 指出打包产物文件名为 `bundle.js`.
- `--mode=development`: 使用开发者模式进行打包。

其打包产物为：

![development 模式下的产物](https://img-blog.csdnimg.cn/2021051800124860.png)

作为对比，尝试下生产模式下的打包产物：

```bash
npx webpack --entry ./index.js --output-path ./dist --output-filename bundle.js --mode=production
```

![production 模式下的产物](https://img-blog.csdnimg.cn/20210518001423629.png)

可以看出，webpack 为生产模式提供了肉眼可见的优化。

## 使用配置文件

单纯使用命令行来配置 webpack 太过繁琐，因此需要使用配置文件。

在项目的根目录创建 `webpack.config.js` 文件，其内容为：

```js
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    // __dirname 指明项目的目录
    // path.resolve 将参数拼接为路径
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development'
}
```

随后执行：

```bash
npx webpack 
# 在默认情况下 webpack 会读取 webpack.config.js 作为配置文件
# 也可以通过 webpack --config xxxx 指定配置文件
```

即可获取与上文一致的结果。

## 放到 HTML 中

多数情况下，webpack 打包产物需要放到浏览器环境中运行。

对此，只需要创建 html 文件，并引入打包产物即可：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>webpack-learn</title>
</head>
<body>
  <script src="./dist/bundle.js"></script>
</body>
</html>
```

用浏览器打开，其结果为：

![浏览器控制台内输出了运行结果](https://img-blog.csdnimg.cn/20210518002102939.png)
