# 移动端上 0.5px 的线

移动端上，有时 1px 的边距线条无法满足 UI 的需求，因此需要使用 0.5px 的宽度。

但是，在 chrome 中，px 单位并不支持小数点：

例如：

```html
<head>
 <style>
  .line {
   width: 100px;
   height: 100px;
   border: 1px solid black;
  }
  .tiny-line {
   margin: 10px;
   width: 100px;
   height: 100px;
   border: 0.5px solid black;
  }
 </style>
</head>
<body>
 <div class="line"></div>
 <div class="tiny-line"></div>
</body>
```

chrome 中的效果为，可见，二者并没有区别。

![chrome 中的 0.5px 和 1px](https://img-blog.csdnimg.cn/20210620175538334.png)

## 实现 0.5px 的多种方式

首先来看 0.5px 的效果，下图中，上为 1px, 下为 0.5px:

![0.5px 的效果](https://img-blog.csdnimg.cn/20210620175254449.png)

### 方式一：scale

```css
.tiny-line {
   width: 200px;
   height: 200px;
   border: 0.5px solid black;
   transform: scale(0.5);
}
```

### 方式二：view-port

设置 meta 标签内的 `initial-scale=0.5`, 但由于它改变了页面所有元素，因此并不实用。

```html
<meta name="viewport" content="width=device-width, initial-scale=0.5">
```

### 方式三：渐变透明

该方法的原理是将 border 的一半边改成透明颜色：

```css
.tiny-line {
 height: 1px;
 background-image: linear-gradient(0deg, black 50%, transparent 50%);
}
```
