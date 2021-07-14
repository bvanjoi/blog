# 从图片加载来看 Promise

最近看到这么一段代码：

```js
function loadImage(src) {
  return new Promise((resolve, reject) => {
   const imgEle = document.createElement('img');
   imgEle.src = src;
   imgEle.onload = function() {
    resolve(imgEle)
   }
   imgEle.onerror = function() {
    reject('image load filed.')
   }
  })
}
```

很普通的一个加载图片的函数，但是让我意识到了，`async/await` 并不能完全取代 `Promise`, 至少我目前不清楚上述代码怎么优雅的改成 `async/await`.

简而言之，`async/await` 并不互斥，二者相互相成。
