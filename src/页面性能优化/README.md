# 项目优化：开发优化与生产优化

本文以 webpack 作为打包环境，总结 emirror 项目中的 webpack 各种优化配置。

## 开发环境

目的：降低打包（编译和上线）速度。

- 开启 gzip 压缩，进而加快打包速度: devServer.compress.
- 开启 sourceMap, 优化开发体验。
- 开启 rules.oneOf, 保证一个文件只被一个 loader 处理。
- 使用编译缓存，忽略不需要重新打包的代码
  - 开启 HMR, 保证按需热更新: devServe.hot. 若不开启该功能时，修改某个 js/css 代码，会导致整个页面的重新打包。
  - babel-loader.options.cacheDirectory, 当它开启时，webpack 打包时会先检查 node_module/.cache/babel-loader, 并据此重新打包 js。
- thread-loader 开启多进程打包，因为它是一个 node 服务，进程启动约 600ms, 因此，建议在耗时比较长的打包中使用.

## 生产环境

- 本质：平衡本地资源大小与 http 请求数。
- 目的：降低资源大小，减少白屏时间, SEO, 减少资源请求数.

---

- 代码压缩
  - js 代码： mode: 'production'
    - tree-shaking
    - 压缩已有代码
  - html 代码： HtmlWebpackPlugin.minify
  - css:
    - MiniCssExtractPlugin: 抽取样式文件
    - 压缩样式文件: webpack5 中的 css 压缩 CSSMinimizerWebpackPlugin, webpack4 中的 optimize-css-assets-webpack-plugin
  - contenthash 实现缓存
- 代码分割，保证每个打包产物足够小，通过多入口或者动态引入实现。
- 按需加载，例如动态引入 polyfill, 懒加载，webpackPrefetch 实现预加载等。
- 资源
  - 较小的资源内联到代码内，较大的资源放到 CDN 上：
    - url-loader, file-loader, raw-loader 使用 options.limit
    - webpack5 中 module.rules[].type: 'asset', 并用 Module.Parse.rule 规定大小
  - 对于 CDN 上的资源，适当使用 强缓存/协议缓存。
- Service Worker 使得其可以离线浏览。
