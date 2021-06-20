# class 组件中为什么设计成需要 bind

对于 JavaScript 比较陌生的用户可能非常困惑：为什么在 React 类组件中，对于函数，需要进行 bind 处理。

> 本文的示例可见：<https://codepen.io/bvanjoi/pen/OJpdRNw>

## bind 绑定 this

示例中给出：

```jsx
class Btn3 extends React.Component {
  constructor() {
    super();
  }
  
  handleClick() {
    console.log('btn3', this)
  }
  
  render() {
    return <button onClick={this.handleClick}>button3(no bind)</button>
  }
}
```

当上述代码执行点击时，效果为：

![没有 bind 的 this](https://img-blog.csdnimg.cn/20210616214415789.png)

随后，来看 bind 之后的代码：

```jsx
class Btn2 extends React.Component {
  constructor() {
    super();
  }
  
  handleClick() {
    console.log('btn2', this)
  }
  
  render() {
    return <button onClick={this.handleClick.bind(this)}>button2</button>
  }
}
```

效果为：

![bind 之后的 this](https://img-blog.csdnimg.cn/2021061621452063.png)

综上，bind 的原因在于没有绑定 this, 进而导致执行 `onClick` 时 `this` 为 undefined.

------------

### 为什么需要 bind

当我们点击时，执行的是 handleClick 函数，而若为 `onClick = {this.handleClick}`, 则会在运行时读入 `onClick` 的上下文，而 `onClick` 上下文为空， 因此输出 undefined.

综上，写成 `onClick={this.handleClick.bind(this)}` 来保证读入的是 class component 的上下文。

## 从源码层面来看，为什么设计成这样

之后，便有一些疑问：

为什么 React 内部不做一些处理，使得 `onClick={this.handleClick}` 也能读到 class component 的上下文？是无法做到？还是设计上的思考？

TODO:
