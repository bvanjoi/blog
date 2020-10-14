# ssr 优化 seo 入门

首先说明两个名词：

- ssr: server side render, 服务器端渲染
- csr: client side render, 客户端渲染

另外一个名词：

- seo: search engine optimization, 搜索引擎优化，通俗而言，就是通过优化来提升搜索排名。

## 先说结论

ssr 对 seo 更加友好的原因在于：搜索引擎可以识别服务器端返回的字符串，而无法识别由 csr 生成的 bundle.js 文件渲染的内容。

## 从 Title 和 Description 说起

做好 seo 的第一步，需要写好相关的 head, 即以下部分：

```html
<head>
  <title>my blog</title>
  <meta name="Description" content="这是我的个人博客，搜索引擎快过来，搜索引擎快过来">
</head>
```

首先，title 和 description 是非常重要的，以搜索“中国大学“为例，某度给出的结果如下：

![“中国大学”返回结果](https://img-blog.csdnimg.cn/2020100718321044.png)

打开排名第一的返回结果，查看其网页源码，其 title 和 meta 部分为：

![第一个搜索结果的 title 和 meta 部分](https://img-blog.csdnimg.cn/20201007183505199.png)

对比搜索结果页，可以发现，title 和 meta 作为展示来源，是吸引用户点击的重要组成部分。

但是，由于现代搜索技术早以**全文**而不是单纯的 head 部分作排名指标，所以，head 部分虽重要，但其主要的目的是提高用户点击率/转化率，对提升搜索结果排名**并无大用**。

此处，我们可以使用 [React-Helmet](https://github.com/nfl/react-helmet) 实现 react 下的 title 和 description 的定制。

## 如何做好 SEO

考虑：搜索引擎会考虑一个网页哪几个部分？

答案很简答，无外乎：

- 文字：对于文字而言，搜索引擎会将*原创性*作为一个关键的指标，千篇一律的内容其得分会比较低。
- 链接：链接还可以分为外链和内链。外部链接指向该网站的数量越多，可以认为该网站的影响力越大，因此排名会上升；内部链接指向的内容要与当前网页相关。
- 多媒体（图片、视频、音频）：以图片为例，原创高清的图片会提高排名。

以上优化方法基于一个前提：**网站是由服务器端渲染的**。
