# 不同的 sourceMap 模式的不同效果

书写 webpack.config.js 时，有一个最基本的点：从 `entry` 开始打包，最终产物为 `output` 配置下的文件，

例如：

```js
{
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
}
```

这意味着，运行在页面上的代码只有一个 `bundle.js`.

上述方式会带来一个开发上的问题：由于代码被压缩到一个文件夹，那么调试代码时只能看到打包产物的执行结果。

sourceMap 便可解决上述问题，它提供了打包产物到源代码的映射。

-----

例如，对于以下项目目录：

```txt
/
--/dist
   -- bundle.js
--index.js
--lib.js
```

相对应的文件内容为：

```js
// index.js
const {print} = require('./lib');
// 这里有一个错误代码：
print(); console.log('index.js')();
```

```js
// lib.js
module.exports = {
  print() {
    console.log('lib.js');
  }
}
```

## 不同 sourceMap 的不同效果

启动 sourceMap 的字段为 webpack.config.js 下的 `devtool` 字段，它总从 `[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map` 的组合方式。

其含义为：

- `inline`: 将 .map 文件作为 DataURI 嵌入，不生成单独 .map 文件；
- `hidden`: 不会给打包产物添加引用注释；
- `eval`: 每个模块动用 `eval` 执行；
- `nosources`:  不暴露源码；
- `cheap`: 不包含列信息；
- `module`: 包含 loader 的 sourcemap

综合来看，共有以下选项：

- `false`
- `"eval"`
- `"eval-cheap-source-map"`
- `"eval-cheap-module-source-map"`
- `"eval-source-map"`
- `"cheap-source-map"`
- `"cheap-module-source-map"`
- `"inline-cheap-source-map"`
- `"inline-cheap-module-source-map"`
- `"source-map"`
- `"inline-source-map"`
- `"hidden-source-map"`
- `"nosources-source-map`

### `false`

生产环境下的 `devtool` 默认为 `false`.

此时打包效果为：

![devtool 为 false](https://img-blog.csdnimg.cn/20210608154210255.png)

此时，完全看不出错误属于哪个文件（因为根本没有映射信息产生）

### `eval`

生产环境下的 `devtool` 默认为 `eval`.

该模式下，sourceMap 通过 eval 被内联在打包产物中：

![devtool 为 eval 的打包产物](https://img-blog.csdnimg.cn/20210608154530528.png)

借此，我们可以看到相关的源代码信息：

![eval 模式下的定位](https://img-blog.csdnimg.cn/2021060815473383.png)

### `source-map`

`devtool: "source-map"` 模式下，打包结果为：

![source-map 下的效果](https://img-blog.csdnimg.cn/20210608164449825.png)

可见，该模式生成了一份映射文件(.map)，在该文件的帮助下，可以将调试信息具体到行内：

![具体到行内的调试信息](https://img-blog.csdnimg.cn/20210608164602158.png)

## TODO: 剩余的 source-map

TODO: 用到时再看。

## sourceMap 的原理

sourceMap 的原理其实并不复杂，例如，执行 `npx webpack`, 产物会生成一定的映射信息（ .map 文件或内联在 bundle 中），借助这些信息，即可实现映射。
