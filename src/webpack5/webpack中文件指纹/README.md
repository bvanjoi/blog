# webpack中文件指纹

以知乎为例，打开控制台，可以看到 script 标签引入的脚本文件的名称后带有 hash 后缀，这就是文件指纹.

![文件指纹](https://img-blog.csdnimg.cn/20210605171436144.png)

从作用上来讲，文件指纹可用于版本管理，缓存文件。

## 常见的 hash 的概念

- `hash`: 每次 webpack 构建，都会生成唯一的 hash 值。
- `chunkhash`: chunk 是指，从一个入口文件开始打包生成的产物。
- `contenthash`: 依据文件内容生成的 hash 值。

### hash

`hash` 与整个项目的构建有关，只要项目文件修改，整个项目构建的 hash 值便会修改。

用法：将 `webpack.config.js` 中的 `output.filename` 从 `bundle.js` 改为 `bundle.[hash].js`.

随后，执行 `npx webpack serve` 启动项目：

可见生成的 `bundle.js` 中带有 hash 值。

![first hash](https://img-blog.csdnimg.cn/20210605173802527.png)

随后，随意输入字符并保存，可见其 hash 值发生变化。

![after changed hash](https://img-blog.csdnimg.cn/202106051739583.png)

### chunkhash

`chunkhash` 与 webpack 打包的 chunk 有关，不同的 entry 生成不同的 chunkhash 值。

### contenthash

`contenthash` 是根据文件内容来定义 hash, 文件内容不变，则 `contenthash` 不变。

> chunkhash 和 contenthash 用法与 hash 类似，在支持该功能的字段中添加 `[contenthash]`, `[chunkhash]` 即可。
