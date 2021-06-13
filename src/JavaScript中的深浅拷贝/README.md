# JavaScript 中的深浅拷贝

## 数据类型

JavaScript 中定义 **基本类型** 为即无对象，也无方法的数据，其中，共定义了七种：

- string
- number
- bigint
- boolean
- null
- undefined
- symbol

基本类型最大的特性为：**所有基本类型的值是不可改变的**。

例如，对于一串字符串：

```js
let s = "1234"
let s2 = s;
s2 += '5';
console.log(s2) // 12345
console.log(s)  // 1234
// 原始值并未改变
```

而与此特性相对的，是引用数据类型: `Object`. (`Object` 包括 `Array`, `Function`, `Set`, `Map` 等。)

例如：

```js
let o = {a:1}
let o2 = o;
o2.b = 2;
console.log(o); // {a:1, b:2}
console.log(o2);// {a:1, b:2}
```

对于上述引用类型，当其复制时，传递的是一个指针，那么问题来了，如何实现引用类型的拷贝呢？

## 拷贝类型：浅拷贝和深拷贝

浅拷贝和深拷贝都是拷贝引用类型值的操作，但是二者又有些不同：

- 浅拷贝：拷贝引用类型中的基本数据类型，对于其中的引用类型，只拷贝其指针。
- 深拷贝：开辟一份新的内存，之后将其引用类型递归拷贝过来。

例如：

```js
let o = {a:1}
// 复制引用类型
let o2 = o;
o2.b = {c:2};
// 此时 
// o, o2 的值均为 {a:1, b: {c:2}}

// 深拷贝 deepCopy
let o4 = deepCopy(o)
o4.e = 5;
o4.b.f = 4;
// 此时
// o, o2 的值为 {a:1, b: {c:2}}
// o4 的值为 {a:1, b:{c:2, f:4}, e:5}

// 浅拷贝 shallowCopy
let o3 = shallowCopy(o)
o3.d = 3;
o3.b.c = 4;
o3.b.g = 6;
// 由于 o.b, o2.b, o3.b 指向同一片内存区域，因此值为：
// o, o2 的值为 {a:1, b:{c:4, g:6}}
// o3 的值为 {a:1, b:{c:4, g:6}, d:3}

// 但是注意， o3.b 和 o2.b, o.b 中的 `b` 并不想等
// 例如，
o3.b = 7
// 随后，
// o, o2 的值为 {a:1, b:{c:4, g:6}}
// o3 的值为 {a:1, b:7, d:3}
```

## shallowCopy 和 deepCopy 的实现

下面，来关注 shallowCopy 和 deepCopy 的实现方法

浅拷贝的实现方式有：

```js
function shallowCopy(o) {
 return Object.assign({}, o);
}
function shallowCopy2(o) {
 return {...o};
}
function shallowCopy3(o) {
 const target = {};
 for (const i in o) {
  target[i] = o[i];
 }
 return target;
}
```

深拷贝的实现方式有：

```js
function deepCopy(o) {
 return JSON.parse(JSON.stringify(o));
}
function deepCopy2(o) {
 const target = {};
 if (typeof o !== 'object') {
  return o;
 }
 for (const i in o) {
  target[i] = deepCopy(o[i]);
 }
 return target;

}
```
