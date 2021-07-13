# `string` vs `new String()`

来看 JavaScript 中三种生成字符串的情况：

```js
let s1 = '123'
let s2 = String('456');
let s3 = new String('789');
```

## 从类型系统开始思考

JavaScript 中提供了两种类型：

- 原始类型：boolean, number , undefined, string, bigint, Symbol.
- 引用类型：Object, WeakSet, WeakMap, Set, Map.
- null

下面一一来看：

- 原始类型，其特性为自身值不可被改变。它们可以使用 `typeof` 来检查：
  - `typeof true` 的结果为 `boolean`
  - `typeof 1` 的结果为 `number`.
  - `typeof undefined` 的结果为 `undefined`
  - `typeof '1'` 的结果为 `string`
  - `typeof 123n` 的结果为 `bigint`
- 引用类型：`typeof` 不起作用，因为所有从 `Object` 派生处的结构类的类型均为 `Object`, 例如：
  - `typeof (new Set())` 的结果为 `object`

## 回到字符串

```js
let s1 = '123' // s1 为原始类型创建的，它的类型为 string.
let s2 = String('456') // 将 String 看作函数，将 '456' 转化为字符串类型，其类型为 string.
let s3 = new String('789'); // s3 为引用类型：字符串对象，类型为 object。
```

## 扩展 1: 使用 `String` 将其他类型转化为 string

从 `let s2 = String('456')` 可以看到，`String` *函数* 的作用可以将外在值转化为字符串，那么，就可以将其转化为字符串：

```js
[1,2,3].map(String);
// 其返回值为 ['1','2','3']
```

## 扩展 2: `[]` vs `new Array()`

不同于 `'123'` vs `new String('456')`, 左侧两者生成的是 string 类型和 object 类型；

而 `[]` 和 `new Array()` 生成的类型均为 object.

