# JavaScript 模块化发展

项目开发过程中，模块化是必不可少的一个概念：将单独的功能写成独立的模块，需要时按需引入该模块。

但是，由于 JavaScript 早期语言设计上的缺陷，导致前端模块化规范层出，最终以 ECMA 官方发布的 ES6 Module 为止。

本文就来探讨 JavaScript 模块化发展进程。

## 早期 JavaScript 缺失模块化规范导致的问题

我们知道，如果想要在页面中使用 JavaScript, 需要在 HTML 引入相应的脚本。

假设当前的目录结构如下：

```txt
|- module1.js
|- module2.js
|- index.html
```

其中：

- `module1.js` 的内容为：

  ```javascript
  var pos = 'in module1'
  ```

- `module2.js` 的内容为：

  ```javascript
  var pos = 'in module2'
  ```

- `index.html` 的内容为：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>JavaScript Module</title>
  </head>
  <body>
    <script src="./module1.js"></script> 
    <script src="./module2.js"></script> 
    <script >
      console.log(pos);
    </script>
  </body>
  </html>
  ```

随后，用浏览器打开 `index.html`, 其结果为：

![控制台输出为 in module2](https://img-blog.csdnimg.cn/20210513000039499.png)

这是因为 html 文件按顺序加载，且引入 js 脚本暴露在全局作用域下，导致 `module2.js` 中的 `pos` 变量覆盖了 `module1.js` 中同名的变量。

## 一些简单的结局方案

- 方法一：由于 `var` 设计原因，重复声明不会报错，将其更换为 `let` 或 `const`, 则可以从语法层面规避该问题。

  例如，将 `module1.js` 的内容更改为：

  ```javascript
  // module1.js
  let pos = 'in module1'
  ```

  其结果为：

  ![执行到 var pos = 'in module2' 时报错](https://img-blog.csdnimg.cn/2021051300042614.png)

- 方法二：采用命名空间的写法：

   ```javascript
  // module1.js
  const module1 = {
    pos: 'in module1'
  }
  ```

  ```javascript
  // module2.js
  const module2 = {
    pos: 'in module2'
  } 
  ```

  ```html
  <!-- body 中的内容 -->
  <script src="./module1.js"></script> 
  <script src="./module2.js"></script> 
  <script >
    console.log(module1.pos);
    console.log(module2.pos);
  </script>
  ```

  输出结果为：

  ![符合预期的输出结果](https://img-blog.csdnimg.cn/20210513000746107.png)

  但是，命名空间也存在极大的问题：由于 JavaScript 中对象属于引用类型，导致即使用 `const` 声明，值也会被修改，即诸如 `module1.pos = 'test'` 是可以正常运行的。

## IIFE: 使用闭包来实现变量私有化

既然在**全局作用域**下变量可被修改，那么可以将其写入到**函数作用域**下，随后通过闭包来实现变量的不被销毁，则可以解决上述问题：

```js
// module1.js
(function(window) {
  var pos = 'in module1';
  function getPos() {
    return pos;
  }
  window.module1 = {getPos}
})(window)
```

```js
// module2.js
(function(window) {
  var pos = 'in module2';
  function getPos() {
    return pos;
  }
  window.module2 = {getPos}
})(window)
```

```html
<!-- body -->
<script src="./module1.js"></script> 
<script src="./module2.js"></script> 
<script >
  console.log(window.module1.getPos());
  console.log(window.module2.getPos());
</script>
```

其结果为：

![符合预期的结果](https://img-blog.csdnimg.cn/2021051300203221.png)

同时，得益于 JavaScript 中闭包的特性，保证 `pos` 变量无法被修改，例如：

![无法被修改的 pos](https://img-blog.csdnimg.cn/2021051300220176.png?)

> 同时，该方法也是 webpack 打包工具等打包构建的基本思路。

## 模块化规范

当然，随着前端项目的复杂化，各种模块化规范也百家争鸣：有 RequireJS 采用的 AMD; SeaJS 采用的 CMD; NodeJS 采用的 CommonJS; 还有官方推出的 ES6 Module.

本文来简单介绍 CommonJS 和 ES6 Module.

### CommonJS

CommonJS 规范采用 `require` 和 `module.exports` 导入导出模块。

例如：

```js
// lib.js
const pos = 'in lib';
const getPos = () => {
  return pos;
}
module.exports = {getPos}
```

```js
// index.js
const {getPos} = require('./lib');
console.log(getPos())
// in lib
```

## ES6 Module

ES6 Module 很大程度上决定了 JavaScript 模块化的走向，相比于 CommonJS 等社区规范，ES6 Module 得到了浏览器原生的支持，因此也具有更优秀的性能。

其用法为：

```javascript
// lib.js 中导出
// named 方式导出
export const pos = 'in lib';
// default 方式导出
export default function getPos() {
  return pos;
}
```

```javascript
// index.js 引入
import getPos, {pos} from './lib';
```

### Node 中使用 ES6 Module

Node 中使用 import/export 并常见，但作为扩展，可以稍加了解，其使用方式有两种：

- 通过 Babel, 将 ES6 Module 转译为 CommonJS.
- 对于 Node v9 以上的版本，可以将其后缀由 `.js` 改为 `.mjs`, 随后运行，例如：

```js
// lib.mjs
export const pos = 'in lib';
export default function getPos() {
  return pos;
}
```

```js
// index.mjs
// index.js 引入
import getPos, {pos} from './lib.mjs'; // 注意加上 .mjs 的后缀
console.log(getPos()) // in lib
console.log(pos) // in lib
```
