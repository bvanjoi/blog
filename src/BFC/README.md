# BFC

所谓 BFC, 即 Block formatting context, 直译为 “块级格式化上下文”, 它是指一个独立的块级渲染区域。这个区域与外部毫不相干。

## 从外边距折叠开始说起

```html
<head>
 <style>
  div {
   width: 100px;
   height: 100px;
   margin: 100px 0;
   background-color: darkcyan;
  }
 </style>
</head>
<body>
 <div></div>
 <div></div>
</body>
```

首先思考一下， 两个 div 之间上下间距是多少？

第一反应是 200px, 因为 第一个 div 有 `margin-bottom: 100px`, 第二个 div 有 `margin-top: 100px`, 合起来就是 200px.

但事实并非如此：

![观察 body 的高度](https://img-blog.csdnimg.cn/20210612175428892.png)

从左上角的数值可以看到，body 的高度竟然为 300px. 两个 div 的高度分别为 100px, 也就是它们二者的间距居然是 100px.

这就是所谓的外边距折叠，同一个 BFC 内，兄弟元素在垂直方向上的外边距发生了叠加。

此时，可能有一个疑问，怎么就突然处于同一个 BFC 内了呢？

## 创建 BFC 的方式

- body, body 元素就是一个 BFC, 上述问题的谈论的 BFC 即指此。
- float 除 none 之外的值；
- position 为 fixed 或者 absolute.
- display 为 inline-block, table-cells, table, flex 等。
- overflow 除 hidden 的值。

## 解决外边距折叠

既然一个 BFC 内会发生塌陷，那么创建两个 BFC 不就可以了：

```html
<head>
 <title>BFC</title>
 <style>
  div {
   display: flex;
  }
  p {
   width: 100px;
   height: 100px;
   margin: 100px 0;
   background-color: darkcyan;
  }
 </style>
</head>
<body>
 <div>
  <p></p>
 </div>
 <div>
  <p></p>
 </div>
</body>
```

效果为：

![被撑开的 margin](https://img-blog.csdnimg.cn/20210612180414785.png)

## BFC 的作用

- 两栏布局
- 清除浮动
- 防止被浮动元素覆盖
- 防止外边距折叠
- ...
