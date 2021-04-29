# Chrome 中由合字引发的渲染问题

> 前置知识
>
> - HTML/CSS 基础
>

## 不符合预期的渲染

```html
<html>
  <head>
    <style>
      span {
        background-color: #ddd;
      }
    </style>
  </head>
  <body>
    <div>f<span>fxxx</span></div>
    <div>f<span>ixxx</span></div>
    <div>f<span>lxxx</span></div>
    <div>f<span>flxxx</span></div>
    <div>f<span>fixxx</span></div>
  </body>
</html>
```

思考一下，上述代码渲染是结果是什么？

以 `<div>f<span>fxxx</span></div>` 为例，渲染结果应该为：

- 一个字符 f
- 剩余带有背景颜色的字符 fxxx

类似于：

f`fxxx`.

可是，事实上并非如此，在 chrome 中，其渲染结果如下：

![Chrome 下不符合预期的渲染](https://img-blog.csdnimg.cn/202104292338433.png)

> Chrome 版本为 89.0.4389.114.

可以看到，在最终的渲染结果中 `span` 标签中的前几个字符出现了偏差，本该带上背景颜色的字符却没有带上。

再看 DOM 元素，可以看到虽然 DOM 树正确，但是渲染出现了问题：Chrome 将 ff, fi, fl, ffl, ffi 渲染成了一个特殊样式的字符：

![Chrome 将其渲染成一个字符](https://img-blog.csdnimg.cn/20210429234347120.gif)

## 其他浏览器呢

用 Safari 浏览器打开该文件，其渲染结果为：

![Safari 下符合预期的的渲染](https://img-blog.csdnimg.cn/20210429234517163.png)

可见，Safari 是正常渲染的。

这表明，这是 Chrome 的渲染引擎导致的问题。

## 寻找问题的来源

首先思考：为什么这些字符会被特殊处理？

查询一些资料后了解到，字体排版中一个**合字**(Ligature)的概念，它是指将多个字母合成一个字形。

例如：

- 字母 `W` 源自于 `VV` 或 `UU`.
- 字符 `&` 源自于 `et`.

而上述问题，便是将 `ffi` 视作了 `ﬃ`, `ff` 视作 `ﬀ` 等等。

## 解决方法

在 CSS 中，有一个名为 `font-variant-ligatures` 只要将其值设置为 `none` 即可修复问题。

即修改文件为：

```html
<html>
  <head>
    <style>
      span {
        background-color: #ddd;
        font-variant-ligatures: none;
      }
    </style>
  </head>
  <body>
    <div>f<span>fxxx</span></div>
    <div>f<span>ixxx</span></div>
    <div>f<span>lxxx</span></div>
    <div>f<span>flxxx</span></div>
    <div>f<span>fixxx</span></div>
  </body>
</html>
```

最终在 Chrome 下的效果为：

![设定 css 后符合预期的渲染](https://img-blog.csdnimg.cn/20210429234712861.png)
