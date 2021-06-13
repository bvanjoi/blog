# 节流与防抖

节流与防抖是开发过程中常见的性能优化手段，他们本质是通过降低函数的执行次数（这些函数可能发出网络请求）来减小开销。

- 节流(throttle): 在某段时间内，若重复触发该函数，只执行第一次触发。
- 防抖(debounce): 函数在触发一段时间后再执行，如果在此期间，该函数被重新调用，则重新统计该时间。

## 节流与防抖的实现

首先，节流和防抖二者都是高级函数，它们的用法示例为：

```js
const debounceClick = debounce(clickFn, time);
const throttleClick = throttle(clickFn, time);
```

所以，首先可以明确，它们二者的返回值为一个函数。

### 节流

```js
function throttle(fn, time) {
 let prev = 0;
 return function() {
  const now = Date.now();
  if (now - prev > time) {
   fn();
   prev = now;
  }
 }
}
```

效果为：

![throttle 效果](https://img-blog.csdnimg.cn/20210611150216657.gif)

可以看到，尽管持续点击，但是只有一次起作用。

### 防抖

```js
function debounce(fn, time) {
 let timeout;
 return function() {
  if (timeout) {
   clearTimeout(timeout)   
  }
  timeout = setTimeout(() => {
   fn();
  }, time);
 }
}
```

效果为：

![debounce 效果](https://img-blog.csdnimg.cn/20210611145253436.gif)

可以看到，持续点击并没有触发函数，只有停止点击后，才触发一次。
