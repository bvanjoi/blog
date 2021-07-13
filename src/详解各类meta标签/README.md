# 详解各类 meta 标签

meta 标签提供关于 HTML 文档的元数据，这些数据用于告知机器如何解析这个页面。

> 元数据：关于数据的信息。

[TOC]

## charset 定义页面编码

```html
<meta charset="UTF-8">
```

## viewport

首先从三种视口讲起：

### 布局视口(layout viewport)

![layout viewport](https://img-blog.csdnimg.cn/20210613200124182.png)

页面的布局视口可以通过以下来获取：

```js
window.innerHeight
window.innerWidth
```

### 视觉视口(visual viewport)

![visual viewport](<https://img-blog.csdnimg.cn/2021061320015754.png>

### 理想视口(ideal viewport)

宽度和视觉视口相同，可以使用下列配置：

```html
<meta name="viewport" content="width=device-width">
```

### viewport 特征

|name|value|description|
|-|-|-|
|width| number or 'device-width' |视口的宽度|
|height| n px|视口高度|
|initial-scale| [0.0 - 10.0]|初始缩放值|
|minimum-scale| [0.0 - 10.0]|缩放值最小比例|
|maximum-scale| [0.0 - 10.0]|缩放值最大比例|
|user-scale| 'yes' or 'no' |是否永续用户手动缩放页面|

## format-detection

`format-detection` 可以检测 HTML 中的一些格式，比如手机号：

```html
<meta name="format-detection" content="telephone=yes">
```
