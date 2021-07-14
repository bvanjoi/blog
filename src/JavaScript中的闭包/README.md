# JavaScript 中的闭包

```js
function p(fn) {
 let a = 200;
 fn();
}

let a = 100;
function fn() {
 console.log(a);
}

p(fn)
// 100
```

**闭包中变量是在函数定义的地方向上查找，而不是在执行时**。
