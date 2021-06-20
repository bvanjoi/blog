# 获取图片原始宽高

借助 BOM 提供的 `Image` 对象，可以实现该操作。

```js
function loadImageAsync(url) {
   return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function() {
     const obj = {
      w: image.naturalWidth,
      h: image.naturalHeight
     }
     resolve(obj);
    }
    image.onerror = function() {
     reject(new Error('Could not load this image'));
    }
    image.src = url
   })
  }
```
