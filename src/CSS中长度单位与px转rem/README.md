# css 长度单位与 px 转 rem

移动开发时代，代表绝对长度的 px 很难满足不同设备下不同分辨率的开发。

例如：

![iphone 分辨率](https://img-blog.csdnimg.cn/20210607113249638.png)

单纯 iphone 的分辨率已经让人眼花缭乱了，更不提机海般的安卓设备。

## 绝对长度与相对长度

再实现 px 转 rem 之前，需要先了解一些基本的长度单位：

> 页面按照像素精确展示，不会因为其真实物理尺寸的变化而改变。

### 绝对长度单位

首先介绍最重要的 px:

- px, pixel, 1px 是一个像素点（相对于屏幕分辨率）。

例如：

![内含有 939px * 684px 的页面](https://img-blog.csdnimg.cn/20210607120235248.png)

随后看物理单位在 css 中的映射:

- in, inch, 英寸为物理单位，但是在 css 中，被映射成像素，并被定义为 1in = 96px.

![1in = 96px](https://img-blog.csdnimg.cn/20210607120445301.png)

|绝对长度单位|转坏为 px|
|-|-|
|cm| 1cm = 37.8px|
|mm| 1mm = 3.78px|
|pt| 1pt = 1/72in = 96/72px|
|pc| 1pc = 12pt|

### 相对长度单位

- em: 1em 表示**当前元素**的 `font-size` 的计算值。
- rem: 1rem 表示**根元素**的 `font-size` 的大小。若 rem 用在 根元素 上时，则表示初始值。

例如：

``` html
<head>
  <style>
    div {
      font-size: 24px;
    }
    .p1 {
      font-size: 1rem; /* 16px */
    }
    .p2 {
      font-size: 1em; /* 24px */      
    }
  </style>
</head>
<body>
  <div>
    <p class="p1">
      hello
    </p> 
    <p class="p2">
      world
    </p>
  </div>
</body>
```

效果为：

![1rem vs 1em](https://img-blog.csdnimg.cn/20210607123039886.png)

- vh: 1vh 为视窗高度的 1%.
- vw: 1vw 为视窗宽度的 1%.
- vmin: min(vh, vw).
- vmax: max(vh, vw).
- %: 占据父元素的百分比。
- fr: grid 布局中的长度单位。

## px 转 rem

再次明确一个概念： rem 相对的是根元素 `<html>` 的 `font-size` 的值。

因此： `n px = n / [html.font-size] rem`.

在项目中，可以一直使用 px 进行开发，最终在打包阶段，使用诸如 postcss 等库来实现转换。
