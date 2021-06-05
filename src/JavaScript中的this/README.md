# JavaScript 中的 this

JavaScript 中的 `this` 是一个繁琐复杂的概念，但是大致可以分为以下五种：

- 全局环境下的 `this`, 例如函数的直接调用；
- 上下文中的 `this`, 例如调用对象中的函数；
- `call`, `apply`, `bind` 绑定  `this`;
- 构造函数下的 `this`.

> 上述四者的优先级从低到高。

- 箭头函数中的 `this`.

作为示例，观察下列函数的在不同环境下的输出。

```js
function consoleThis() {
  console.log(this);
}
```

## 全局环境下的 `this`

直接执行函数时 `this` 指向全局，例如：

```js
// 直接执行（非严格模式下）
consoleThis() // global or window 对象
```

当然，在严格模式下，指向的为 undefined.

```js
function consoleThis2() {
  'use strict'
  console.log(this);
}
consoleThis2() // undefined
```

## 指向上下文的 `this`

例如：

```js
const p = {
  name: 'mike',
  consoleThis,
  brother: {
    name: 'lucas',
    consoleThis
  }
}
p.consoleThis() // {name: 'mike', consoleThis: Function, brother: Object}
p.brother.consoleThis() // {name: 'lucas', consoleThis: Function}
```

## 用 `call`, `apply`, `bind` 改变 `this` 指向

例如：

```js
consoleThis2.call(p.brother.name) // lucas
```

> 更多关于 `call`, `apply`, `bind` 区别的内容可见：[JavaScript 中 call, apply, bind 的原理与实现](../JS中call,apply,bind的原理与实现/README.md)

## 构造函数中的 `this`

例如：

```js
function person() {
  this.name = 'jack'
}
console.log((new person()).name) // jack
// 这证明了 new 生成的实例指向一个对象
```

下面，考虑 new 一个函数时发生什么：

1. 构造一个对象；
2. 将 `this` 指向该对象；
3. 为该对象增加方法、属性；
4. 返回该对象。

> 关于 ES6 的 class 可以参考：[JavaScript中的继承](../JavaScript中的继承/README.md)

同时，当构造函数存在显式的 `return` 时，需要注意两种情况：

- 返回的是构造函数内部的对象：

```js
function person2() {
  this.name = 'penny';
  const obj = {};
  return obj;
}
console.log(new person2()) // {}, 表明返回 obj.

```

- 返回的是非对象的值:

```js
function person3() {
  this.name = 'tom';
  return 1;
}
console.log(new person3()) // {name: 'tom'}, 表明返回目标对象的实例 this
```

## 箭头函数中的 `this`

ES6 中的箭头函数有一个关键的特性：它的 `this` 是静态的，例如，在 指向上下文的 this 中，如果将 p.brother.consoleThis2 更改为箭头函数，会将其指向外层：

```js
const a = () => {
  console.log(this)
}

const arrowP = {
  name: 'mike',
  consoleThis() {
    return this;
  },
  brother: {
    name: 'lucas',
    consoleThis: () => {
      return this;
    }
  }
}
console.log(arrowP.consoleThis()) 
// {name: 'mike', consoleThis: Function, brother: Object}, 指向当前对象
console.log(arrowP.brother.consoleThis()) 
// {}, 等价于 a() 的返回结果
console.log(a()) 
// {}
```

由于 箭头函数中 `this` 的静态性质，导致它不能当作构造函数。

> 更多箭头函数的内容可以参考：[ES6 中的箭头函数](../箭头函数/README.md)
