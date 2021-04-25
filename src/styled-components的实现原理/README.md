# styled-components 的实现原理

> 前置知识：最基本的 React 知识

## JSX and CSS

考虑这么一个场景，如果想实现颜色为红色的文字组件，用 React, 该怎么写？

方式有很多，首先最基本的一种：

```css
/* index.css 文件 */
.info {
  color: 'red';
}
```

```javascript
import './index.css'

const ColorSpan = () => <span className="info">Hello</span>
```

上述代码即实现了红色文字的效果：

// TODO: image

但是有一个问题：虽然实现了关注点分离的效果，但是也带来了全局污染等问题。

解决方法之一就是 CSS in JS.

## style in JSX

最简单的一种思想就是写成内联样式：

```javascript
const ColorSpan = () => 
  <span className="info" style={{color: 'red'}}>
    Hello
  </span>
```

但是，由于内联样式存在优先级过高，并且无法使用伪类和伪元素，由此该方案几乎不会被采用。

## styled-components

styled-components 是一个优秀的 CSS in JS 的实现方式，其实现上述功能的代码如下：

```javascript
import styled from 'styled-components';

const ColorSpan = styled.span`
  color: red;
`;
```

效果为：

// TODO: image

我们注意到，上图的 DOM 树中生成的标签类名为一个随机的字符串，由于 styled-components 的算法，使得该字符串唯一不会重复，因此不会存在全局污染的问题。

到这里，我其实有一个困惑：styled-components 是如何生成基于类名选择器的 CSS 代码？

因此，来看它的执行流程。

### styled-components 执行流程

对于代码：

```javascript
styled.span`
  color: red;
`
```

它名为[标签模板](../模板字符串/README.md)，属于 ES6 模板字符串的一个特性，它本身属于函数的语法糖，因此 `ColorSpan` 等价于：

// TODO: 链接 changed

```javascript
const ColorSpan = styled.span(['color: red']);
```