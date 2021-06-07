# publicPath/contentBase 的关系

本文主要总结 webpack 中三种容易混淆的配置参数(public, publicPath, contentBase)的关系。

## path

path 这个字段主要应用在 output 字段下，例如：

```js
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
}

// 上述代码将以 index.js 为入口打包
// 最终产物生成为 __dirname/dist/bundle.js
```

## publicPath

在 devServer 和 output 两个字段下，同时拥有 publicPath 字段。

- output.publicPath 表示的是打包生成的 index.html 中引用资源的前缀。
- devServer.publicPath 表示的是打包生成的静态文件的位置。（若 devServer 中的 publicPath 字段为空，则会读取 output.publicPath）。

首先在根目录下定义一个 html 模板，用以 `HtmlWebpackPlugin`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>public-learn</title>
</head>
<body>
</body>
</html>
```

### output.publicPath

首先，定义 `webpack.config.js` 内容如下：

```js
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack-learn',
      inject: 'body',
      template: './index.html'
    })
  ],
}
```

随后，执行 `npx webpack` 进行打包，结果如下：

![output.publicPath 为空的情况](https://img-blog.csdnimg.cn/202106071646217.png)

----

随后，添加 out.publicPath:

```js
output: {
  ...
+ publicPath: 'testtesttest'
}
```

再次打包的结果如下：

![output.publicPath 存在](https://img-blog.csdnimg.cn/20210607164736325.png)

### devServer.contentBase

> devServer 用于配置 webpack server 生成的网络服务，记住，它的产物只存在于内存中，因此使用相对路径时可能会出现一些问题。（因为相对路径指向了本地磁盘）
>
> 因此，建议使用 path 库生成绝对路径。（官网也是这么推荐的）

如果说 publicPath 是服务于打包产物的字段，那么 contentBase 则可以认为是服务静态资源的字段。

例如，我们之前在根目录下创建 `index.html`, 开发启动项目时，会读取 `/index.html`.

如果我们想将 `index.html` 移动到另外的文件夹，同时还能在开发阶段读取到，则需要使用 `contentBase` 字段。

例如，若文件目录为

```txt
/public
--- index.html
```

则需要设置为：

```js
{
  devServer: {
    // 仅仅供演示
    contentBase: './public'
  }
}
```

此时，执行 `npx webpack serve`, 可见它读取到了相应的文件。

### devServer.publicPath

最后，来看 devServer.publicPath, 首先，它的优先级高于 `contentBase`.

为了在开发阶段读入正确的打包产物，需要在 devServer 中填写 `publicPath`.

可以写成：

```js
{
  devServer: {
    // 指向了内存中的打包产物
    contentBase: path.join(__dirname, '../dist')
  }
}
```

随后，便可以读取到相应的 `index.html`.
