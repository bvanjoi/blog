# webpack 实现热更新的三种方式

开发阶段，一直使用 `npx webpack` 命令进行打包十分繁琐，为了优化开发体验，webpack 提供了多种热更新的方式。

## 文件监听

webpack 提供一个参数：`watch`, 当它为 true 时表明开启监听模式：每次源代码发生变化时，会自动重新构建并输出打包文件。

使用方式：`npx webpack --watch`.

效果：

![webpack --watch](https://img-blog.csdnimg.cn/20210605114553774.gif)

可以看到，每次保存时，都会执行依次打包命令（控制台中有相应输出），打包完成后页面发生变化。

### `watch` 原理

对于 `watch` 字段，webpack 也提供了一系列的 Options, 通过学习这些 Options, 可以简要获知其运行原理。

```js
// webpack.config.js 中的 module.export 的字段

// 开启监听模式，默认为 false,
watch: true,
// 监听模式的配置
watchOptions: {
  // 不监听的文件
  ignore: /node_modules/,
  // 第一个文件变化后，随后 aggregateTimeout 内的所有文件变化，只会打包一次
  aggregateTimeout: 300,
  // 每隔 poll ms 轮询一次，检查文件是否发生变化
  poll: 1000,
}
```

从 `poll` 字段可知，`webpack watch` 是通过轮询查看是否文件发生变化，若变化，则重新打包。

> `webpack watch` 还有一个问题：每次打包产物均放到 dist/ 文件夹下，这表明每次打包产物实际上是与磁盘发生了 I/O, 这种操作是非常耗时的。

## webpack-dev-server 实现热更新

首先，执行 `yarn add -D webpack-dev-server` 安装。

随后，在 `webpack.config.js` 中增加以下内容：

```javascript
devServer: {
  // 告知 webpack-dev-server 静态文件路径
  contentBase: '.',
  // 告知 webpack-dev-server 打包产物的路径
  // 优先级高于 contentBase
  // 为了演示，仅使用相对路径，实际项目中，应该使用域名下的绝对路径
  publicPath: '/dist',
}
```

随后，执行 `npx webpack serve` 可以看到：

![webpack-dev-server 启动成功](https://img-blog.csdnimg.cn/20210605151846767.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NkNDU2Nzg1NQ==,size_16,color_FFFFFF,t_70)

可以看到，已经在本地的 8080 端口启动。

> 注意，webpack5 中使用 `npx webpack serve` 的指令，而 webpack4 中，使用诸如 `npx webpack-dev-server` 的指令。

其效果为：

![webpack-dev-server 热更新](https://img-blog.csdnimg.cn/20210605152046713.gif)

另外，不同于 `webpack watch`, webpack-dev-server 的热更新没有任何 I/O 操作，它是将打包产物放到内存中，若访问不同的打包产物，可以使用 `publicPath` 配置。

### webpack-dev-server 原理

webpack-dev-server 本质上属于开启了一个 node server(默认为 8080 端口), 当本地项目内的文件发生变化时，会通过 HMR Server(Hot Module Replacement, 已内置在 webpack-dev-server 中) 来与浏览器通信，随后更新文件：

```txt
                        webpack dev server              Browser bundle.js
                       -----------------------        ----------------------
local file changed ->  compiler  -> HMR Server  ->   | HMR Runtime -> js code
                         |                           |
                         |------> bundle Server -->  |
```

## webpack-dev-middleware 实现热更新

webpack-dev-middleware 被内置到了 webpack-dev-server 中，但是它也可以单独拿来使用，其作用是生成一个与 webpack 的 compiler 绑定的中间件，然后在 node-server 启动服务时调用该中间件。

在介绍 webpack-dev-middleware 用法之前，首先介绍一个 webpack 插件：HtmlWebpackPlugin.

### HtmlWebpackPlugin

插件 HtmlWebpackPlugin 可以简化 HTML 文件的创建，使得自身不需要创建 html 文件。

借助此插件，可以删除掉之前的 `index.html`.

### 使用 webpack-dev-middleware

以 express 作为 node-server 作为示例。

首先，需要安装 `yarn add -D webpack-dev-middleware`, `yarn add express`.

随后，将 `webpack.config.js` 配置如下：

![webpack-dev-middleware 下 webpack.config.js 配置](https://img-blog.csdnimg.cn/20210605161652941.png?)

随后，创建 `server.js` 文件：

```js
const express = require('express')
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// 使用中间件
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

// 启动服务
app.listen(3000, function () {
});
```

使用命令： `node server.js` 启动，效果为：

![webpack-dev-middle-ware 热更新](https://img-blog.csdnimg.cn/20210605162121184.gif)
