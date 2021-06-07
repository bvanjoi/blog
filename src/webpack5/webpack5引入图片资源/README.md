# webpack5 打包图片资源的方式

首先，先区分下如何引入图片：

- 方式一：通过 css 引入，例如：

  ```css
  .image-div {
    background-image: url('xxxxxx');
  }
  ```

- 方式二：通过 html 标签引入，例如：

  ```html
  <img src="./xxx.jpg" alt="yyyy">
  ```

下面，将讨论如何在 webpack 中打包图片资源。

首先，随便找一张图片，例如下图，将其命名为 cat.jpg.

![cat.jpg](https://img-blog.csdnimg.cn/20210607182624251.jpg)

随后，目录结构为：

```
/
-- cat.jpg
-- index.html
-- style.css
-- index.js
-- webpack.config.js
```

其中，

- `index.html` 内容为：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>webpack-image</title>
</head>
<body>
  <div class="image-container"></div>
  <img src="./cat.jpg" alt="this is a cat image">
</body>
</html>
```

- `index.js` 内容为：

```js
import './style.css'
```

- `style.css` 内容为：

```css
.image-container {
  width: 100px;
  height: 100px;
  background: center / contain no-repeat  url('./cat.jpg');
}
```

## 处理 css 引入图片

### url-loader, file-loader

首先，执行 `yarn add -D url-loader file-loader` 安装相应的 loader,

随后， webpack.config.js 的配置写为：

```js
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'url-loader',
          }
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack-learn',
      inject: 'body',
      template: './index.html'
    })
  ],
}
```

随后，执行 `npx webpack`, 查看效果：

![打包图片后的结果](https://img-blog.csdnimg.cn/20210607184238508.png)

分析以下上述情况：

- css 中引入的图片正常显示，这是因为 url-loader 检测到了 .jpg 文件，随后将其引入。
- html 中引入图片未正常显示，该原因与解决方案稍后再说。

但是，css 引入的这张图片是有问题的，因为它通过 base64 的形式引入（即将图片视为二进制），但是，由于图片本身过大，也会导致页面过大，可见 bundle.js 的大小为 1.7MB, 而其中，大部分都是 base64 的内容。

![base64 导致打包产物过大](https://img-blog.csdnimg.cn/20210607185102627.png)

为了解决上述问题，可以设置一个阈值：大于该阈值的资源，存储在CDN（线上环境）/内存（本地环境），之后通过 HTTP 请求来获取。

该阈值的设定可以使用 webpack.config.js 中的 `url-loader` 参数：

```js
// webpack.config.js
//....
{
  test: /\.jpg$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        // 大于 1024kb 则使用 http
        // 否则以 base64 的形式存储
        limit: 1024
      }
    }
  ]
}
```

执行 `npx webpack` 重新打包，结果为：

![http 请求方案](https://img-blog.csdnimg.cn/20210607185138416.png)

### webpack5 新特性：资源模块

实际上，在 webpack 官网，已经明确告知 `url-loader`, `file-loader`, `raw-loader` 三个库已经不再维护，诸如引入图片的方式可以使用 webpack5 中的**资源模块**。

![webpack 官网公告](https://img-blog.csdnimg.cn/20210607185311993.png)

根据官网指导，可以更改 webpack 配置为：

```js
{
  test: /\.jpg$/,
  type: 'asset/resource'
}
```

`npx webpack` 重新打包后，效果是一样的。

> 注，对于需要转化成 base64 的图片，可以使用 `type: asset/inline`.

## 处理 html 引入图片

来看未解决的问题：html image 引入的图片失败。

这是因为，`src="./cat.jpg"` 指向的是打包前的路径，而打包后，该路径是不存在的：

![打包产物](https://img-blog.csdnimg.cn/20210607185754459.png)

因此，知晓了问题所在。

那么，来解决问题：可以使用 html-loader 来引入图片。

首先，安装该依赖：`yarn add html-loader -D`, 随后，配置该依赖：

```js
// webpack.config.js
module: {
  rules: [
    //.......
   {
      test: /\.jpg$/,
      type: 'asset/resource'
    },
    {
      test: /\.html$/,
      use: 'html-loader'
    }
  ]
}
```

随后，`npx webpack` 打包，其结果为：

![html-loader 处理后的打包产物](https://img-blog.csdnimg.cn/20210607190122952.png)
