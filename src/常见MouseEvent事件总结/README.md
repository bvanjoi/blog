# MouseEvent 总结

## mousemove 等回调参数为 MouseEvent 类型的事件

为了了解鼠标事件的 DOM 事件，假设存在以下 HTML 结构：

```html
<div id="items">
  <ul>
    <li id="item1"><button>item1</button></li>
    <li id="item2"><button>item2</button></li>
    <li id="item3"><button>item3</button></li>
  </ul>
</div>
```

如果我们给 `div[id="items"]`增加以下监听事件：

- `mousemove`: 当鼠标在相应的标签区域**移动**时，会触发该事件，由于该事件会非常被频繁的触发，在实际工程中，会按需设置防抖或截流。

![mouseover 示例](https://img-blog.csdnimg.cn/20210404104003811.gif)

- `mousedown` 与 `mouseup` 与 `click`: 当鼠标在区域**按下**鼠标时，会触发 `mousedown` 事件，**松开**鼠标后，会触发 `mouseup` 事件，二者组成 `click` 事件。

![mouseover, mouseup, click 示例](https://img-blog.csdnimg.cn/20210404104359877.gif)

- `mouseenter` 与 `mouseleave` 示例：当鼠标**进入**区域时，触发 `mouseenter`, 离开区域时，触发 `mouseleave`.

![mouseenter, mouseleave 示例](https://img-blog.csdnimg.cn/20210404104848256.gif)

- `mouseover` 与 `mouseout` 示例：效果与 `mouseenter` 类似，不同的是：进入/离开该标签下的每一项，都会触发改事件。

![mouseover, mouseout 示例](https://img-blog.csdnimg.cn/20210404105429610.gif)

## MouseEvent 中的偏移量

假设存在以下 HTML 结构：

```html
<head>
  <style>
    #item {
      width: 300px;
      height: 300px;
      background-color: #ffeccf;
    }
  </style>
</head>
<body>
  <div id="item"></div>
  <script>
    item.onclick = (e) => {
      // 该 e 的类型即为 MouseEvent, 它包含以下偏移量
      // clientX, clientY
      // offsetX, offsetY
      // pageX, pageY
      // screenX screenY
      // layerX, layerY
      // x y
      c
    }
  </script>
</body>
```

### MDN 中的解释

| Attribute | Explain |
| -         | - |
| `clientX`, `clientY` | 光标相对于**客户端窗口**的水平/垂直位置|
| `offsetX`, `offsetY` | 光标相对于**当前标签元素的左上角**的水平/垂直位置|
| `pageX`, `pageY`     | 光标相对于**页面左上角**的水平/垂直位置|
| `screenX`, `screenY` | 光标相对于**屏幕**的水平/垂直位置|
| `layerX`, `layerY`   | 光标向上找有定位属性的父元素的左上角（自身有定位属性的话就是相对于自身），都没有的话，就是相对于body的左上角的水平/垂直位置|
| `x`, `y`             | 同 `clientX`, `clientY`|

### `clientX` 与 `clientY`

不论是否滚动，二者可以表示为：

![clientX clientY](https://img-blog.csdnimg.cn/20210404135312853.png)

### `pageX` 与 `pageY`

若页面不存在滚动，即为 `clientX`, `clientY`.

但若页面存在滚动，则为 `pageY = window.scrollY + e.clientY`.

### `offsetX`, `offsetY`

二者可表示为：

![offsetX offsetY](https://img-blog.csdnimg.cn/20210404135500703.png)

### `screenX`, `screenY`

二者可表示为：

![screenX screenY](https://img-blog.csdnimg.cn/20210404135727384.png)
