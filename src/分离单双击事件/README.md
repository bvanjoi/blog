# 分离单双击事件

移动端的浏览器上，很多时候需要判断用户是单击还是双击某个元素。

首先，给出两个 API:

- [single click](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick)
- [double click](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondblclick)

以上两个 API 可以给 DOM 元素绑定上 单击、双击 的事件。

但是，有一个问题：无法区分单双击。

即，考虑如下 HTML 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Click</title>
</head>
<body>
  <button id="btn">test</button>
  <script>
    const btn = document.getElementById('btn');
    btn.onclick = () => {
      console.log('single click');
    }
    btn.ondblclick = () => {
      console.log('double click')
    }
  </script>
</body>
</html>
```

当我们双击 button 标签时，会出现如下情况：**触发双击事件的同时也触发了单击事件**。

![双击 button](https://img-blog.csdnimg.cn/20201016200717870.gif)

## 用定时器解决问题

首先说出解决思路：

**在某个时间段内双击了元素，则视为双击；在某个时刻单击了元素，且在该时间段内没有再次点击元素，则为单击。**

实现思路：借用定时器。

将 script 中的内容更改为如下：

```javascript
  const btn = document.getElementById('btn');

  let time = 200;
  let timeOut = null;

  btn.onclick = () => { // 单击时
    clearTimeout(timeOut);  // 清除上一次单击时 setTimeout 的返回值，用于实现双击时不触发单击
    timeOut = setTimeout( () => {
      console.log('single click')
    }, time);
  }
  btn.ondblclick = () => {
    clearTimeout(timeOut);
    console.log('double click');
  }
```

逻辑：

- 单击时：只触发 `onclick` 函数，并在 time 毫秒后执行 `setTimeout` 中的内容，如果在 time 毫秒内多次触发单击（同时没有双击操作），则由于 `clearTimeout`, 会有防抖效果。
- 双击时：先触发了两次 `onclick` 函数，之后触发了 `ondblclick`. 过程如下：
  1. 当第一次点击时，触发了 `onclick` 函数；
  2. 第二次点击时候：首先再次触发 `onclick` 函数，在该 `onclick` 中，清除了第一次 `onclick` 中的 `setTimeout` 效果，但随之也产生了一个新的 `setTimeout`, 随后，触发了 `onblclick` 函数，在该函数中，`clearTimeout` 首先用于清除第二次单击时产生的 `setTimeout`, 随后代码为双击时事件。

最终效果如下：

![单双击事件分离](https://img-blog.csdnimg.cn/202010171446054.gif)
