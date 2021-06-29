# JavaScript 中函数中对象传参

一份很小的知识点，JS 中函数参数传递分为引用传参和值传参。

- 值传参：拷贝一份值；
- 引用传参：**拷贝**一份引用的值。

```js
let obj = {width: 800, height: 600};

function change(obj){
 // 拷贝的是 obj 的引用 
 obj = {width: 1024, height: 768};
 obj.width = 700;
}

change(obj);
console.log(obj);
```
