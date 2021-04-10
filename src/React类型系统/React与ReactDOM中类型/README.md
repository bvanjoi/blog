# React 与 ReactDOM 中类型

在  `@types/react` 和 `@types/react-dom` 中，定义了一系列的类型，繁杂的类型系统让人迷惑，因此，本文将阐述一些经常使用的类型的含义。

## @types/React

### JSX

JSX 是 JavaScript 语法扩展，它仅仅是 `React.createElement` 的语法糖。

例如，对于 jsx 代码：

```js
<button
  classNames="btn" 
  onClick={
    () => {
     console.log('You had click btn')}
    }
  >
  Hello
</button>
```

经过 babel 编译后的 js 代码为：

```js
"use strict";

/*#__PURE__*/
React.createElement("button", {
  classNames: "btn",
  onClick: () => {
    console.log('You had click btn');
  }
}, "Hello");
```

可见，JSX 最终被编译成 React 类型。

---

首先来看位于 `@type/react` 中的 `namespace JSX`:

几种常见的类型：

- `JSX.Element`: 即 JSX 表达式，例如，`const Button = () => <button type='button'/>`, 其返回值为 `JSX.Element`.
- `JSX.ElementClass`: 即类表达式，它约束了 class 组件中唯一必须实现的方法 `render`.
- `JSX.IntrinsicElements`: 固有元素，即 h5 标签元素，例如 `<div>test</div>`, `<a href="http://www.baidu.com">baidu</a>`.
- `JSX.ElementAttributesProperty`: 规定元素必须传入的*属性*参数, 在 React 中为 `{props: {}}`.
- `JSX.ElementChildrenAttribute`: 规定元素比如传入的*孩子*参数，在 React 中为 `{children: {}}`.

### React

在 `namespace React` 中，最常使用的接口和类型有：

- `React.ReactElement`, 它是 React 中最基本的类型
- `React.ReactNode`: 在 `react.d.ts` 文件中可见有 `ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined`, 所有在 JSX 中可以渲染的组件。
- `React.Component`: 类组件。
- `React.PureComponent`: 与 `Component` 类似，区别在于 `shouldComponentUpdate()` 中，`PureComponent` 将 `prop` 和 `state` 进行了浅层的比较；而 `Component` 中一直返回 true.
- `React.FunctionComponent`: 简写为 `React.FC`, 即为函数组件，在其函数中，`props` 自带有 `children` 元素；同时，`React.FC` 还为函数增加了 `displayName` 等字段。
- `CSSProperties` 定义了组件中 `style` 的类型。
- `SyntheticEvent`: React 中的事件类型的基类，例如 `React.MouseEvent`.
- `EventHandler`: React 中事件处理的类型，例如 `<button onClick={}>` 中的 `onClick` 为 `MouseEventHandler`.

## @types/react-dom

在 `namespace ReactDOM` 中：