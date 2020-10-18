# TODO

> 承认痛苦的无用性。

## 软件工程

1. [DevOps 流程](./src/DevOps/README.md)

---

## 计算机理论基础

### 数据表示

1. 使用位运算来判断二数是否相等
2. 遵从 IEEE 754 表示的浮点数不能精确表示的最小整数 CSAPP 2.49
3. 使用位运算来判断二进制中是否包含奇数个 1.  CSAPP 2.65
4. 二进制中最左侧的 1. CSAPP 2.66

### 汇编

1. 寄存器一览
2. 进位标记位(CF) 与 溢出标记位(OF) 的区别。 有符号无符号、示例、寄存器中的存储形式
3. x86 中标记位的含义

---

## 算法与数据结构

1. N 皇后的两种解法：回溯与 SAT

### 数论

1. [关于斐波那契数列，我知道的都在这里了](./src/斐波那契数列/README.md)
2. [判断素数的一些方法](./src/判断素数方法/README.md)

### 回溯

1. WIP [全排列](./src/全排列/README.md)

### 排序算法

---

## Linux

1. [Linux 常见指令](./src/Linux/Linux常见指令.md)
1. [Linux 目录结构](./src/Linux/Linux目录结构.md)

---

## C

1. `printf("%lf", 3/2);` 为什么输出 `0.0000`.

### GDB

1. [GDB 入门](./src/GDB入门/README.md)

---

## Rust

1. Rust 这种内存安全的语言是如何处理闭包的？

---

## HTML

1. [HTML 中异步加载 JS 文件](./src/HTML中异步加载JS文件/README.md)
2. [搞懂 script 标签中 defer 和 async](./src/搞懂script标签中defer和async/README.md)

## CSS

1. outline 与 border 的区别

## JavaScript

1. [JavaScript 中的继承](./src/JavaScript中的继承/README.md)
2. Array.prototype.flat() 为什么只能 flat 一层？
3. 用 setTimeout 实现动画，以及 setTimeout 的原理。
4. 类数组与数组以及类数组在 typescript 中的类型。
5. 为什么说“函数是一等公民”
6. number 和 Number 的区别
7. 为什么 0.1 + 0.2 === 0.3 返回 false.
8. 装饰器
9. 不同函数调用方式下的 this 指向
10. 箭头函数
11. 闭包
12. [分离单双击事件](./src/分离单双击事件/README.md)

### node.js

1. 从 I/O 密集与 CPU 密集谈一谈 node.js （单线程，异步，非阻塞I/O, 事件驱动，node 中间层的实际作用）

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

### React

1. React API 示例：从搭建一个脚手架开始
2. `static getDerivedStateFromProps` 示例

### BOM: Browser Object Model

### DOM: Document Object Model

1. DOM 操作中 querySelector 和 getElementById 的区别。 （后者可以 .style -> 区别）
2. onclick 和 addEventListener 的区别
3. 属性 nodeType 的应用
4. HTML-DOM 和 DOM Core, CSS-DOM

## 前端工程化

1. npm, npx, yarn, nvm, ts-node, tsc 这些名词的区别。
2. javascript 模块化

### webpack

1. [写一个 webpack 插件](./src/写一个webpack插件/README.md)

### SSR

### SEO

1. WIP [ssr 优化 seo 入门](./src/ssr优化seo入门/README.md)
2. prerender 预渲染技术

### Hybrid

1. [Hybrid 入门](./src/Hybrid入门/README.md)

---

## 机器学习

1. [k-近邻算法](./src/k近邻算法/README.md)
