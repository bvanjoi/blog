# 将 `typeof` 用于 SSR 中

## 客户端渲染与服务端渲染

前面页面有两种渲染方式：客户端渲染(Client Side Rendering, CSR)与服务端渲染(Server Side Rendering, SSR)。

考虑这么一个过程：当你打开一个页面，直到这个页面内容呈现出来，网页必然与其服务器有一个数据交互的过程。

那么，需要思考的是：页面是如何依据服务端返回的数据渲染的？

- 如果服务器向本地发送回来一个 `bundle.js` 文件，由浏览器解析该文件，最终生成页面内容，那么这种渲染方式可以认为是**客户端渲染**，这里的客户端指的是浏览器内核（ PC 上的浏览器，或者 AP P内的 Webview）。
- 如果服务器向本地发送回来一串 HTML 格式的字符串，浏览器拿到这一串字符串后可以跳过解析内容而直接渲染，则为**服务端渲染**。

CSR 与 SSR 的优劣在此不提，只需要记住：由于 SSR 返回的 HTML 非常利好于 SEO, 所以绝大多数内容网站必须进行 SSR 渲染。

## 那么，坑是什么

虽说是服务端渲染，但实际上，现代（2021年）前端架构中充当服务端的是 node 层。HTML 文件实际上是在 node 层被生成并被传送到客户端环境的。

而 node, 本质上是 JavaScript 的运行环境。

同时，浏览器（客户端）也是 JavaScript 运行环境。

所以，很多前端团队，为了提高开发效率，采用一种**同构**的方式来书写代码，即客户端代码与服务端代码（再说一遍，这里的服务端指的是 node 层，服务器的数据返回到 node 层，由node 层渲染成 HTML 文件）使用一套代码的不同构建方式来实现 node 层和前端页面。

可以这么理解：同样一套代码，如果是 SSR, 则走到 node 层生成成 HTML 后直接渲染；而如果是 CSR, 则走到前端代码，生成 `bundle.js` 这种打包产物后再交给浏览器渲染成 HTML.

问题在于，node 和浏览器虽然都能运行 JavaScript, 但由于面向的使用场景不同，二者也有一些不同的 API.

例如，浏览器环境提供了一个常用的 API, 叫做 `window`.

如果你想获取一个页面的域名，打开开发者工具，直接输入 `window.location.host` 即可：

```javascript
console.log(window.location.host);
```

但是在 node 中，直接输入 `window`, 会返回报错：

```JavaScript
console.log(window);
// Uncaught ReferenceError: window is not defined
```

坑点来了：一套代码，却在不同的环境下执行，如何保证其正确性？

## typeof

JavaScript 提供了一个关键字：`typeof`, 顾名思义，它可以检测一个变量的类型，例如：

```javascript
const a = 1;
console.log(typeof a);
// 'number'
const b = '2';
console.log(typeof b);
// 'string'
const c = {};
console.log(typeof c);
// 'object'
console.log(typeof d);
// 'undefined'
console.log(d);
// Uncaught ReferenceError: d is not defined
```

看最后两条：

1. `console.log(typeof d);`, `d` 是一个没有定义的变量，使用 `typeof d` 后，会返回一个兜底的值：`undefined`.
2. 直接打印**未定义的变量**则会报错。

为此，在同构的情况下，可以使用：

```javascript
const isSSR = () => {
  return typeof window === 'undefined';
}
```

来判定当前是 node 环境还是客户端环境。

## 再坑一点

我们知道，TypeScript 是 JavaScript 的超集，它提供了一系列的语法糖，例如：

```typescript
const e = undefined;
console.log(e?.f);
// undefined
```

`?` 就是一种语法糖，`e?.f` 可以转化为 js 代码 `e && e.f`, 即，当 e 存在时候再执行 `e.f`.

再直白一点：`console.log(e?.f)` 等价于：

```javascript
if (e) {
  console.log(e.f);
}
```

所以，坑点来了，有些人为了简化语法，会在前端代码中写：

```typescript
console.log(window?.location);
```

之后报错，页面崩溃。

为什么？很简单：window 在 node 中不是内置的变量，`window?.location` 转化为 js 代码后相当于 `window && window.location`, 相当于执行了一个**未定义的变量**，因此报错。
