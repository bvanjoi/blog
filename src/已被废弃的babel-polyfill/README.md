# 已被废弃的 babel-polyfill

Babel 官网中，明确指出 7.4.0 之后的版本，已经废弃了 @Babel/polyfill, 转而使用 `core-js/stable` 和 `regenerator-runtime/runtime`.

但还是需要来看一看。

## 从 Babel 的功能开始说起

假设给出下列函数：

```js
const sum = (a,b) => a + b;
Promise.resolve(100).then(res => res);
[10,20,30].indexOf(20);
[].testtesttest(30);
```

经过启用 `preset/env` 的 babel 转义后变为：

```js
"use strict";

var sum = function sum(a, b) {
  return a + b;
};

Promise.resolve(100).then(function (res) {
  return res;
});
[10, 20, 30].indexOf(20);
[].testtesttest(30);
```

此时，可以关注到几件事：

- 箭头函数转化为函数；
- `[].testtesttest(30);` 成功被转义。

这说明，Babel 的转义只是针对语法层面，而不关注 API 是否可用。

这就导致一个问题，如果转义后的 API 在 ES5 环境下不能使用，那该怎么办？

为此，polyfill 就出现了。

## @Babel/polyfill

## polyfill 的一些问题

- 产物比较大，需要配置按需引入，可以根据 `useBuiltIns` 来配置；
- 引入后污染全局变量，例如定义了 `Array.prototype.indexOf`, 但是用户自己也定义了一份，二者造成冲突。对此，可以使用 `@babel/runtime` 和 `@babel/plugin-transform-runtime`.

