# HTML 中异步加载 JS 文件

## 平时习惯：将 script 放到 body 底部

首先，我们有一个意识：对于 HTML 文件而言，要将引入 JavaScript 代码的 script 放到底部。

例如：

首先我们要创建一个名为 `index.js` 的脚本文件，其内容为：

```javascript
const btn = document.querySelector('button');
btn.onclick =  () => {
  alert('we had clicked the button');
};
```

随后在同目录下创建一个名为 `index.html` 的文件，其内容为：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <button>click</button>
  <script src="./index.js"></script>
</body>
</html>
```

在浏览器中打开 `index.html`, 当我们点击 button 按钮时候，效果是：

![处于body底部的script标签效果](https://img-blog.csdnimg.cn/20201014105309777.gif)

但如果我们将其放到 body 顶部或者 head 标签底部，即将 `index.html` 中的代码改写为：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
  <script src="./index.js"></script>
</head>
<body>
  <button>click</button>
</body>
</html>
```

此时，再点击 button 按钮，效果是：

其效果是：

![处于head底部的script标签](https://img-blog.csdnimg.cn/20201014105813272.gif)

此时，浏览器开发者工具中也会报错：

![script标签放到head底部时报错](https://img-blog.csdnimg.cn/20201014114449108.png)

## 原因

上述问题出现的原因在于：浏览器是**同步**解析 HTML 文件的，即对于一个 HTML, 浏览器从上向下依次执行。

在 html 文件中：

- 当 script 标签处于 header 底部时，浏览器优先加载 script 标签的内容，而由于现在还没有解析到 body 中，导致此时 button 标签并不存在，所以 btn 的值为 null, onclick 并没有绑定上。
- 当 script 标签处于 body 底部时，会首先解析之前的标签，最后再执行 script 的内容。

所以，平时将 script 写在 body 的书写方式也就可以理解了：禁止 script 标签阻塞浏览器解析 HTML 内容，以防止出现意想不到的问题，同时还可以优化白屏时间，提高用户体验。

## 如何异步加载 script 标签

在实际工作中，为性能考虑，同步加载也许并不能满足我们的要求，所以我们需要考虑：如何实现异步加载 script 标签。

### defer 与 async

script 标签提供了两个属性，用来异步加载**外部**脚本文件，关于二者的原理与异同可见文章[[WIP] 搞懂 script 标签中 defer 和 async](../搞懂script标签中defer和async/README.md)

我们可以将原 HTML 文件改写为：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
  <script src="./index.js" defer></script>
</head>
<body>
  <button>click</button>
</body>
</html>
```

或：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
  <script src="./index.js" defer></script>
</head>
<body>
  <button>click</button>
</body>
</html>
```

此时，即使 script 标签处于实际展示的内容之上，也可以将 `onclick` 事件绑定到 button 标签上。

### 动态加载 script 标签

首先，看下面代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <script>
    /**
     *
     * @param {string} filePath
     * */
    function loadJS(filePath) {
      debugger;
      if( document.querySelectorAll('script').length > 1) {
      }
      else {
        var newScriptElement = document.createElement('script');
        newScriptElement.src = filePath;
        document.body.appendChild(newScriptElement)
      }
    }
    loadJS('./index.js');
  </script>
  <button>click</button>
</body>
</html>
```

上述代码中，我们创建了一个函数，来动态创建所需的 script 标签。

该方法在创建好 body 元素后开始执行，因此 `document.body`不为空，因此，其效果与在 body 底部引入 script 标签效果等同。
