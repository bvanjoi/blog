# 模板字符串

文本简单介绍 ES6 中模板字符串的用法，已经并不常见的标签模板。

> 模(mú)板 而不是 模(mó)版

## 字符串

自 JavaScript 诞生之初，string 便作为一种原始数据类型存在。

例如，使用单引号或双引号便可以创建字符串：

```javascript
var a = 'hello'
var b = "world"
```

在 ES6 中，引入了模板字符串，它使用反引号来创建字符串：

```javascript
var c = `hello world`
```

当然，模板字符串有一些更强大的能力：

- 插入表达式，可以使用
  
  ```javascript
  var d = 1
  var e = 2
  var f = `${d} + ${e} is equal to ${d + e}`
  // f 的值为 '1 + 2 is equal to 3'
  ```

- 保留空格与换行

  ```javascript
  var g = `Hello
  world`
  // 等价于 'Hello\nWorld'
  ```

模板字符串简化了字符串的书写，属于开发中最常使用的 ES6 功能之一。

## 标签模板

但是标签模版可能有一些冷门，偶尔在开源库中见过。

来看用法，假设我们有一个函数：

```javascript
/**
 * get the max number from args
 * @param  {...number | string} args 
 * @example <caption>Example of usage of getMax</caption>
 * // return 5
 * getMax(1,2,'3',4,5,'extra string')
 */
function getMax(...args) {
  return Math.max(...[...args]
    .map(v => parseInt(v, 10))
    .filter(v => !isNaN(v)))
}
```

则一般会这样用：`getMax(1,2,3,4,5,6)`.

但是，标签模板提供了不一样的使用方法：

```javascript
var h = 1
var i = 2
var j = 3
var k = 4
var l = 5
getMax`I had numbers: ${h},${i},${j},${k},${l}`
```

上面的用法等价于：

```javascript
getMax(
  [ 'I had numbers: ', ',', ',', ',', ',', '' ],
  1, 2, 3, 4, 5)
```

可以看出，标签模板只是函数调用的语法糖，作为参数的模板字符串可以分为两个部分：1. 字符串的内容为第一个参数，为一个 `string[]` 类型；2. 剩余参数为模板字符串中的变量。

## 总结

这篇文章非常简略地介绍了模板字符串和标签模板的用法，另外，写这篇文章的目的在于：希望我下次在开源库中看到有人使用标签模板时，能够想起该用法的名字。
