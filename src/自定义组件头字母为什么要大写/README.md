# React 中，自定义组件头字母为什么要大写

组件是 React 最常见、最常用的一部分，而在 [React 官方文档](https://reactjs.bootcss.com/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)中，要求用户自定义的组件必须以大写字母开头。

这次，我们就来探求这样要求的原因。

## 内置组件与自定义组件

在 React 中，将组件分为两种：

- HTML 内置组件：诸如 `<div>hello</div>` 会被 React 识别为内置组件。
- 用户自定义组件：诸如 `<Hello/>` 会被 React 识别为用户自定义组件。

而区分二者的依据就是：组件的头字母是否大写。

因此，题目中的疑问也迎刃而解：将头字母大写是为了区分组件是自定义组件还是内置组件。

## 发生了什么

上述编写方式中，实际上采用的是名为 JSX 的语法，它看起来像 HTML, 实际上是 [`React.createElement`](https://zh-hans.reactjs.org/docs/react-api.html#createelement) 封装的语法糖。

打开 [babel](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.12.3&externalPlugins=), 输入以下内容：

```javascript
<div>
  Hello
</div>
```

可以看到，在屏幕左侧的输出为：

```javascript
React.createElement("div", null, "Hello");
```

这表明，JSX 转换成了 `React.createElement(type, [props], [...children])`，该 API 实际上才是浏览器真正执行的部分，其中 `type` 是标签的类型，`props` 是各种属性，`children` 是孩子节点。

看一个更复杂的示例：

```javascript
<div id="root">
  <div>
    <span style={{color:red}}>Hello</span>
  </div>
</div>
```

可以看到经过转码之后为：

```javascript
React.createElement(
  "div",
  {
    id: "root"
  },
  React.createElement(
    "div",
    null,
    React.createElement(
      "span",
      {
        style: {
          color: red
        }
      },
    "Hello"
    )
  )
);
```

以上。

我们需要注意一点：在上述 JSX 中，我们使用了内置标签 `div`, `span`, 而转化的 `createElement` 中的**第一个**参数为一个**字符串**。

而对于一个自定义组件来讲：

```javascript
const App = () => {
  return <div>Hello</div>
}
<App/>
```

经过编译后的结果为：

```javascript
const App = () => {
  return React.createElement("div", null, "Hello");
};

React.createElement(App, null);
```

可以观察到，`createElement` 的第一个参数为 `App`, 是一个**函数名**。

## 假如

现在考虑，如果自定义的组件名头字母为小写，会发生什么：

对于自定义组件：

```javascript
const app = () => {
  return <div>Hello</div>
}
<app/>
```

其编译结果为：

```javascript
const app = () => {
  return React.createElement("div", null, "Hello");
};

React.createElement("app", null);
```

此时再看，`createElement` 的第一个参数变成了一个字符串，即一个内置的 HTML 标签 `app`, 由于 HTML 不包含标签 `app`, 进而报错。

至此，我们可以了解：由于 JSX 语法糖的实现机制，首字母大写的组件会以**函数**的形式传入到 `createElement` 中，而小写字母会以**字符串**的形式传入到 `createElement` 中，该机制将二者区分开，属于 React 的设计理念。
