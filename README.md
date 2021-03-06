# TODO

> 承认痛苦的无用性。

## 软件工程

### DevOps

1. [DevOps 流程](./src/DevOps/README.md)

### CI/CD

1. [GitLab-CI/CD](./src/CICD/README.md)

### Git

---

## 设计模式

1. [数据劫持](./src/数据劫持/README.md)
2. [查询与中断](./src/查询与中断/README.md)
3. [观察者模式](./src/观察者模式/README.md)

---

## 计算机理论基础

### 数据表示

1. 使用位运算来判断二数是否相等
2. 遵从 IEEE 754 表示的浮点数不能精确表示的最小整数 CSAPP 2.49
3. 使用位运算来判断二进制中是否包含奇数个 1.  CSAPP 2.65
4. 二进制中最左侧的 1. CSAPP 2.66

### 程序设计

1. [正则序与应用序](./src/正则序与应用序/README.md)

---

## 算法与数据结构

1. N 皇后的两种解法：回溯与 SAT
2. 蓄水池抽样算法 leetcode 382

## 计算机网络

1. [数据交换方式](./src/数据交换方式/README.md)

### 数论

1. [关于斐波那契数列，我知道的都在这里了](./src/斐波那契数列/README.md)
2. [判断素数的一些方法](./src/判断素数方法/README.md)
3. 蔡勒公式
4. 汉诺塔

### 回溯

1. [[WIP]全排列](./src/全排列/README.md)

### 排序算法

---

## Unix

1. Shebang

### Linux

1. [Linux 常见指令](./src/Linux/Linux常见指令.md)
2. [Linux 目录结构](./src/Linux/Linux目录结构.md)

### Vim

> 问：如何实现一个速记的字符串？
>
> 答：让不会 vim 的人退出 vim.

1. [Vim 技巧](./src/vim/skills.md)

---

## C

1. `printf("%lf", 3/2);` 为什么输出 `0.0000`.
2. `fgets` 的用途 CSAPP 3.71
3. 在 C 语言中写汇编 CSAPP 3.73, 3.74

### GDB

1. [GDB 入门](./src/GDB入门/README.md)
2. DDD 入门

---

## 汇编

1. 寄存器一览
2. 进位标记位(CF) 与 溢出标记位(OF) 的区别。 有符号无符号、示例、寄存器中的存储形式
3. x86 中标记位的含义

---

## Rust

> 多年之后，奥雷连诺上校站在内存溢出的程序前，会想起技术沙龙上没好好听 Rust 的那个遥远的下午。

1. [Rust-learn: 1. 从安装到 Hello World](./src/Rust-learn/1.安装/README.md)
2. [Rust-learn: 2. 15 分钟学 Rust](./src/Rust-learn/2.通用编程概念/README.md)
3. Rust 这种内存安全的语言是如何处理闭包的？

---

## HTML

1. [HTML 中异步加载 JS 文件](./src/HTML中异步加载JS文件/README.md)
2. [搞懂 script 标签中 defer 和 async](./src/搞懂script标签中defer和async/README.md)

## CSS

1. outline 与 border 的区别
2. 没有 outline-radius 的 outline 如何实现圆角
3. [white-space 在文本编辑器中的使用](./src/white-space在文本编辑器中的使用/README.md)

## JavaScript

1. [JavaScript 中的继承](./src/JavaScript中的继承/README.md)
2. [JavaScript 中覆盖继承的对象](./src/JavaScript中覆盖继承的对象/README.md)
3. Array.prototype.flat() 为什么只能 flat 一层？
4. 用 setTimeout 实现动画，以及 setTimeout 的原理。
5. 类数组与数组以及类数组在 typescript 中的类型。
6. 为什么说“函数是一等公民”
7. number 和 Number 的区别
8. 为什么 0.1 + 0.2 === 0.3 返回 false.
9. 装饰器
10. 不同函数调用方式下的 this 指向
11. 闭包
12. [分离单双击事件](./src/分离单双击事件/README.md)
13. [event loop](./src/事件循环/README.md)
14. [JavaScript 中 Date 类型](./src/JavaScript的Date类型/README.md)

### ES6

1. [箭头函数](./src/箭头函数/README.md)

### node.js

1. 从 I/O 密集与 CPU 密集谈一谈 node.js （单线程，异步，非阻塞I/O, 事件驱动，node 中间层的实际作用）
2. node 在控制台的输出带样式及原理

### TypeScript

1. 元组
2. interface 与 type 的区别
3. typescript 中的面向对象。
4. implements
5. Enum 的实现方式，常量枚举，以及

```ts
enum Direction {
  Up,
  Down
}

console.log( 0 === Direction.Up)
```

1. 范型

### BOM: Browser Object Model

### DOM: Document Object Model

1. DOM 操作中 querySelector 和 getElementById 的区别。 （后者可以 .style -> 区别，后者更快一点）
2. onclick 和 addEventListener 的区别
3. 属性 nodeType 的应用
4. HTML-DOM 和 DOM Core, CSS-DOM
5. is innerHTML asynchronous? [reference](https://stackoverflow.com/questions/42986295/is-innerhtml-asynchronous)

---

## 前端工程化

1. npm, npx, nrm, yarn, nvm, ts-node, tsc, yrm 这些名词是什么。
2. javascript 模块化
3. `package.json` 中各个 key 值的作用。

### webpack

1. [写一个 webpack 插件](./src/写一个webpack插件/README.md)

### SSR

### SEO

1. [[WIP]ssr 优化 seo 入门](./src/ssr优化seo入门/README.md)
2. prerender 预渲染技术

### React

1. [[WIP]从搭建一个 React 脚手架开始](./src/从搭建一个React脚手架开始/README.md)
2. [自定义组件头字母为什么要大写？](./src/自定义组件头字母为什么要大写/README.md)

### Hybrid

1. [Hybrid 入门](./src/Hybrid入门/README.md)

---

## 机器学习

1. [k-近邻算法](./src/k近邻算法/README.md)
