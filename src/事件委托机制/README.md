# 事件委托机制

## 事件

例如，用户点击某个按钮时触发的函数，即为事件。

## 事件委托示例

例如，下列代码中：

```html
<head>
 <title>Event Delegation</title>
</head>
<body>
  <ul>
   <li><button>btn1</button></li>
   <li><button>btn2</button></li>
   <li><button>btn3</button></li>
  </ul>
 <script>
  document.querySelector("ul").onclick = function() {
   console.log('click button')
  }
 </script>
</body>
```

可以注意到，每个 `button` 标签上没有任何事件，但是在外层的 ul 上有一个 click 事件，那么当点击 button 时，便会触发 ul 上的事件，这就是事件委托。

![事件委托示例](https://img-blog.csdnimg.cn/20210620163238782.gif)

事件委托机制使得开发者不再需要为每个相似功能的元素逐一分配处理函数，只需要将其放到公共标签上即可。借此可以优化性能。

## 事件的捕获与冒泡

**事件委托机制是依赖于事件冒泡**的，因此需要来看事件流中的两个概念：捕获、冒泡。

```html
<style>
  div {
   border: 1px solid black;
  }
 </style>
<div class="b1">
 div1
  <div class="b2">
   div2
   <div class="b3">
    div3
   </div>
 </div>
</div>
```

思考，假如 .b3 绑定一个 click 事件，当点击 .b3 时，事件流的处理是什么样的？

```txt
      事件捕获，逐层向下   事件冒泡，逐层向上
 b1       |                /\ 
  b2      |                 |
   b3    \/                 |
```
