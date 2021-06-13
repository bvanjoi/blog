# loader 运行机制

webpack 中，loader 是最常用的功能之一，它负责处理非 js 和 json 的文件，并将其视为模块来进行打包。

## 示例

下列配置中，给出了解析 css 的示例

```js
module.exports = () =>  {
  return {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    mode: 'production',
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
 },
      ]
    }
}
```

当执行 `npx webpack` 打包时，对于所有文件（因为没有用 oneOf），都会判断是否满足 `test`, 随后再依次使用 `css-loader`, `style-loader` 进行处理。

那么思考：

- webpack 是怎么读到 css-loader 这个库的？
- 读到这些 loader 后，会发生什么。

下面实现 `my-loader`, 它什么都不做，只是将其放到其中，借此来观察 loader 的机制。

## 自己写一个 loader

文件目录：

```txt
|- index.js
|- myLoader
 |- my-loader1.js
|- webpack.config.js
```

其中 `index.js` 内容为：

```js
console.log('hello, this is test for loader')
```

随后，`my-loader1.js` 的内容为：

```js
// 依据 https://webpack.js.org/contribute/writing-a-loader/
// 可知，loader 实际上是一个函数

/**
 *
 * @param {string|Buffer} content Content of the resource file
 * @param {object} [map] SourceMap data consumable by https://github.com/mozilla/source-map
 * @param {any} [meta] Meta data, could be anything
 */
function myLoader1(content, map, meta) {
  console.log('---------------');
  console.log('in my loader 1');
  console.log('content:', content);
  console.log('map:', map);
  console.log('meta:', meta);
  console.log('---------------');
  return content;
}

module.exports = myLoader1;
```

随后，在 `webpack.config.js` 中添加字段：

```js
{
  //.....
  module: {
    rules: [
      //......
      { 
        test: /\.js$/,
        use: 'my-loader1'
      }
    ]
  },
  // 用于解析 loader 的 resolve
  resolveLoader: {
    // 从哪里读 loader
    // 默认情况下为 ['node_modules']
    // 诸如 css-loader 等都是从中获取
    modules: [
      'node_modules', 
      path.resolve(__dirname, 'myLoader')
    ]
  }
}
```

随后执行 `npx webpack`:

![my-loader1 的效果](https://img-blog.csdnimg.cn/20210610183500746.png)

如此，一个毫无用途的 `loader` 便书写完成了。

## loader 执行顺序

我们知道，对于 `use:[xxxx]` 的 loader, 是从右往左依次执行。

但是，实际上 loader 在执行之前，会首先从左向右执行 `pitch` 函数。

例如：

```txt
|- index.js
|- myLoader
 |- my-loader1.js
 |- my-loader2.js
|- webpack.config.js
```

其中

- `my-loader1.js` 增加两行：

```js
+ myLoader1.pitch = function() {
+   console.log('loader1 pitch')
+ }
```

- `my-loader2.js` 为：

```js
function myLoader2(content, map, meta) {
  console.log('---------------');
  console.log('in my loader 2');
  return content;
}
      
myLoader2.pitch = function() {
  console.log('loader2 pitch')
}
      
module.exports = myLoader2;
```

在 `webpack.config.js` 更改为：

```js
- use: 'my-loader1'
+ use: ['my-loader1', 'my-loader2']
```

随后执行打包 `npx webpack`, 结果为：

![loader 执行顺序](https://img-blog.csdnimg.cn/20210610184438444.png)

## 同步 loader 和 异步 loader

loader 执行时，会被 webpack-loader-runner 调用，调用过程中，会被注入上下文 `this`.

而 `this` 中，具有两个函数： `callback` 和 `async`.

- `this.callback` 处理 loader 的结果。;
- `this.async` 可以处理异步 loader.

新增一个异步 loader: `my-loader3.js`,

```txt
|- index.js
|- myLoader
 |- my-loader1.js
 |- my-loader2.js
 |- my-loader3.js
|- webpack.config.js
```

其内容为：

```js
module.exports = function(content) {
 // this.async 表示 这个 loader 会异步的回调
 // 即之后所有的内容都在 callback 中执行
 const callback = this.async();
 setTimeout(() => {
  // 设置为 1s 后再次执行
  callback(null, content);
 }, 1000);
}
```

随后，`webpack.config.js` 改为：

```js
- use: ['my-loader1', 'my-loader2']
+ use: ['my-loader1', 'my-loader2', 'my-loader3']
```

随后执行 `npx webpack`, 其效果为：

![异步 loader 的效果](https://img-blog.csdnimg.cn/20210610191627525.gif)

可见，`setTimeout` 造成了延迟。

## 获取 loader 的配置项

webpack5 中，可以通过 `this.getOptions` 来提取 loader 的选项。

为了演示效果，我们将 `my-loader3` 设置成可以自定义配置的 loader.

将其改为：

```js
module.exports = function(content) {
 const callback = this.async();
 setTimeout(() => {
  callback(null, content);
 // 自定义等待时间，兜底为 1s
 }, this.getOptions().time || 1000);
}
```

随后，在 `webpack.config.js` 更改为：

```js
- use: ['my-loader1', 'my-loader2', 'my-loader3']
+ use: [
+ 'my-loader1',
+ 'my-loader2',
+ {
+  loader: 'my-loader3',
+  options: {
+   time: 1
+  }
+ }]
```

上面设置等待时间为 1ms（由于 `setTimeout` 的实现机制，实际上是 4ms）, 其效果为：

![4ms 的延迟时间](https://img-blog.csdnimg.cn/20210610192833398.gif)

可见，与刚才 1s 相比，几乎没有延迟，证明 `options.time` 起到了效果。
