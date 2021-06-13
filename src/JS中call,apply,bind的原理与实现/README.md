# JavaScript 中 call, apply, bind 的原理与实现

> 在 [JavaScript 中的 this](../JavaScript中的this/README.md) 中，详细讲述了不同情况下的 this.

JavaScript 中 `call`, `apply`, `bind` 为可以强制绑定 `this` 的指向。

## `call`

在 MDN 上，`call` 的定义为： `Function.prototype.call`, 其语法为 `call(this,thisArg, ...argArray)`.

实现：

```js
Function.prototype.myCall = function(arg, ...arguments) {
 var context = arg || window;
 context.fn = this;
 var arr = [];
 for (var i = 0; i < arguments.length; i += 1) {
  arr.push("arguments[" + i + "]");
 }
 var result = eval("context.fn("+ arr.toString() + ")")
 delete context.fn;
 return result;
}
```

## `apply`

在 MDN 上，`apply` 的定义为： `Function.prototype.apply`, 其语法为 `apply(this,thisArg, argArray?)`.

```js
Function.prototype.myApply = function(arg, argArray) {
 var context = arg || window;
 context.fn = this;
 var result;
 if (!argArray) {
  result = context.fn();
 } else {
  var args = [];
  for (var i = 0; i < argArray.length; i++) {
   args.push("arr[" + i + "]");
  }
  result = eval("context.fn("+ arr.toString() + ")")
 }
 delete context.fn;
 return result;
}
```

## `bind`

在 MDN 上，`bind` 的定义为： `Function.prototype.bind`, 其语法为 `bind(thisArg, ...argArray);`.

```js
Function.prototype.myBind = function() {
 var context = [].shift.call(arguments);
 var args = [].slice.call(arguments);
 return () => {
  return this.apply(context, [].context.call(args, [].slice.call(arguments)))
 }
}
```
