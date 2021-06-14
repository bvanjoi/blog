# TODO

> 承认痛苦的无用性。

## 软件工程

### DevOps

1. [DevOps 流程](./src/DevOps/README.md)

### CI/CD

1. [GitLab-CI/CD](./src/CICD/README.md)

---

## 设计模式

1. [数据劫持](./src/数据劫持/README.md)
2. [查询与中断](./src/查询与中断/README.md)
3. [观察者模式](./src/观察者模式/README.md)
4. [构造者模式](./src/构造者模式/README.md)
5. [单例模式](./src/单例模式/README.md)
6. [策略模式](./src/策略模式/README.md)

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
3. 更多可见算法与数据结构可见[Rust 实现算法](https://github.com/bvanjoi/Algorithm)

### 数论

1. [关于斐波那契数列，我知道的都在这里了](./src/斐波那契数列/README.md)
2. [判断素数的一些方法](./src/判断素数方法/README.md)
3. 蔡勒公式
4. 汉诺塔

---

## 计算机网络

1. [数据传输方式](./src/数据传输方式/README.md)
2. [C/S 模式与 P2P 模式](./src/CS模式与P2P模式/README.md)
3. [分组转发中的时延]
4. [TDM, CDM, WDM, WDM, STDM]

### HTTP

1. [URI, URL, URN](./src/URI与URL与URN/README.md)
2. [URL 编码](./src/URL编码/README.md)
3. [HTTP 状态码](./src/HTTP状态码/README.md)
4. [所谓 GET 与 POST](./src/所谓GET与POST/README.md)

---

## 编译技术

> 做语言的主人

1. [将 Lisp 函数转化为 C 类函数](./src/将Lisp函数转化为C类函数/README.md)
2. [借助 Acorn 实现 JavaScript 自定义语法](./src/借助Acorn实现JavaScript自定义语法/README.md)

---

## Unix

1. [Shebang](./src/Shebang/README.md)

### Linux

1. [虚拟化中的三种网络模式](./src/虚拟化中的三种网络模式/README.md)
2. [Linux 常见指令](./src/Linux/Linux常见指令.md)
3. [Linux 目录结构](./src/Linux/Linux目录结构.md)

### Vim

> 问：如何输出一个随机的字符串？
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
3. [Rust-learn: 3. Rust 中的分号](./src/Rust-learn/3.Rust中的分号/README.md)
4. [Rust-learn: 4. 用 Rust 写一棵二叉树](./src/Rust-learn/4.用Rust写一棵二叉树/README.md)
5. Rust 这种内存安全的语言是如何处理闭包的？

---

## HTML

1. [HTML 中异步加载 JS 文件](./src/HTML中异步加载JS文件/README.md)
2. [搞懂 script 标签中 defer 和 async](./src/搞懂script标签中defer和async/README.md)
3. [HTML 全局属性](./src/HTML全局属性/README.md)
4. [详解各类 meta 标签](./src/详解各类meta标签/README.md)
5. [style 标签一定要写在 body 前面吗](./src/style标签一定要写在body前面吗/README.md)

## CSS

1. [CSS 中长度与 px 转 rem](./src/CSS中长度单位与px转rem/README.md)
2. [Chrome 中由合字引发的渲染问题](./src/Chrome中由合字引发的渲染问题/README.md)
3. [white-space 在文本编辑器中的使用](./src/white-space在文本编辑器中的使用/README.md)
4. [BFC](./src/BFC/README.md)
5. [用 CSS 画三角形](./src/用CSS画三角形/README.md)
6. [outline 与 border 的区别](./src/outline与border的区别/README.md)
7. 没有 outline-radius 的 outline 如何实现圆角

## JavaScript

1. [JavaScript 中的继承](./src/JavaScript中的继承/README.md)
2. [JavaScript 中覆盖继承的对象](./src/JavaScript中覆盖继承的对象/README.md)
3. forEach, map 中的异步函数
4. 用 setTimeout 实现动画，以及 setTimeout 的原理。
5. 类数组与数组以及类数组在 typescript 中的类型。
6. 为什么说“函数是一等公民”
7. number 和 Number 的区别
8. [为什么 0.1 + 0.2 === 0.3 返回 false](https://bvanjoi.github.io/IEEE-754-visiable/)
9. 装饰器
10. [JavaScript 中的 this](./src/JavaScript中的this/README.md)
11. [JavaScript 中 call, apply, bind 的原理与实现](./src/JS中call,apply,bind的原理与实现/README.md)
12. 闭包
13. [分离单双击事件](./src/分离单双击事件/README.md)
14. [EventLoop](./src/事件循环/README.md)
15. [JavaScript 中 Date 类型](./src/JavaScript的Date类型/README.md)
16. [JavaScript 中的深浅拷贝](./src/JavaScript中的深浅拷贝/README.md)
17. [节流与防抖](./src/节流与防抖/README.md)
18. [从示例来看 Ajax](./src/从示例来看Ajax/README.md)
19. [Fetch vs Ajax](./src/fetch_vs_ajax/README.md)

### ES6

1. [箭头函数](./src/箭头函数/README.md)
2. [(WIP)解构赋值的默认值](./src/解构赋值的默认值/README)
3. [模板字符串](./src/模板字符串/README.md)

### node.js

1. 从 I/O 密集与 CPU 密集谈一谈 node.js （单线程，异步，非阻塞I/O, 事件驱动，node 中间层的实际作用）
2. node 在控制台的输出带样式及原理

### TypeScript

1. 元组
2. [TypeScript 中的 interface 和 type](./src/TypeScript中的interface和type/README.md)
3. [用 type 替换 enum](./src/用type替换enum/README.md)
4. typescript 中的面向对象。
5. implements
6. Enum 的实现方式，常量枚举，以及

```ts
enum Direction {
  Up,
  Down
}

console.log( 0 === Direction.Up)
```

1. 范型

### BOM: Browser Object Model

1. [页面性能监控](./src/页面性能监控/README.md)
2. [页面存储方式](./src/页面存储方式/README.md)

### DOM: Document Object Model

1. DOM 操作中 querySelector 和 getElementById 的区别。 （后者可以 .style -> 区别，后者更快一点）
2. onclick 和 addEventListener 的区别
3. 属性 nodeType 的应用
4. HTML-DOM 和 DOM Core, CSS-DOM
5. is innerHTML asynchronous? [reference](https://stackoverflow.com/questions/42986295/is-innerhtml-asynchronous)
6. [常见 MouseEvent 事件总结](./src/常见MouseEvent事件总结/README.md)

---

## Web 安全

1. [跨域问题](./src/跨域问题/README.md)

---

## 前端工程化

1. npm, npx, nrm, yarn, nvm, ts-node, tsc, yrm 这些工具是什么。
2. [JavaScript 模块化发展](./src/JavaScript模块化发展/README.md)
3. [mono-repo 之从 npm link 到 lerna](./src/mono-repo之从npm%20link到lerna/README.md)
4. [页面性能优化](./src/页面性能优化/README.md)

### 包管理工具

1. [package.json 常见字段](./src/package.json常见字段/README.md)

### Babel

1. [Babel 入门](./src/Babel入门/README.md)
2. [写一个极简的 Babel 插件](./src/写一个极简的Babel插件/README.md)

### webpack5

1. [webpack 核心概念](./src/webpack5/webpack核心概念/README.md)
2. [使用 loader 解析 css](./src/webpack5/使用loader解析css/README.md)
3. [webpack 实现热更新的三种方式](./src/webpack5/webpack实现热更新的三种方式/README.md)
4. [webpack 中的文件指纹](./src/webpack5/webpack中文件指纹/README.md)
5. [publicPath/contentBase 的关系](./src/webpack5/publicPath与contentBase的关系/README.md)
6. [webpack5 引入图片资源](./src/webpack5/webpack5引入图片资源/README.md)
7. [不同 sourceMap 的不同效果](./src/webpack5/不同sourceMap的不同效果/README.md)
8. [tree shaking 优化代码](./src/webpack5/tree-shaking优化代码/README.md)
9. [代码分割](./src/webpack5/代码分割/README.md)
10. [webpack 模块机制](./src/webpack5/webpack模块机制/README.md)
11. [使用模块联邦实现微前端](./src/webpack5/使用模块联邦实现微前端/README.md)
12. [loader 运行机制](./src/webpack5/loader运行机制/README.md)
13. tapable
14. [myWebpack](./src/webpack5/myWebpack/README.md)
15. [(WIP)写一个 webpack 插件](./src/写一个webpack插件/README.md)

### SSR

1. [将 `typeof` 用于 SSR 中](./src/将typeof用于SSR中/README.md)

### SEO

1. [(WIP)ssr 优化 seo 入门](./src/ssr优化seo入门/README.md)
2. prerender 预渲染技术

## React

1. [从搭建极简的 React 脚手架开始](./src/从搭建极简的React脚手架开始/README.md)
2. [React 中自定义组件头字母为什么要大写？](./src/React中自定义组件头字母为什么要大写/README.md)
3. [React 中的 key](./src/React中的key/README.md)
4. [(WIP)styled-components 的实现原理](./src/styled-components的实现原理/README.md)

### React 类型系统

1. [函数组件中不建议使用 React.FC](./src/React类型系统/函数组件中不建议使用React.FC/README.md)
2. [React 与 ReactDOM 中类型](./src/React类型系统/React与ReactDOM中类型/README.md)

---

## Hybrid

1. [Hybrid 入门](./src/Hybrid入门/README.md)

---

## 机器学习

1. [k-近邻算法](./src/k近邻算法/README.md)
