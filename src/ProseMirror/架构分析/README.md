# ProseMirror 架构分析

本文将沿着 ProseMirror 中的流程，来分析 ProseMirror 的架构。

## `OrderedMap`: 持久化数据存储

在 ProseMirror 中，为了方便的处理数据，定义了一套名为 `OrderedMap` 的持久化存储结构。

具体可见：[OrderedMap](../../OrderedMap/README.md)

## 定义最基本的 Node

首先，定义最基本的几个节点：

```js
// nodes
/** docNodeSpec */
const doc = {
 content: 'block+'
};
/** paragraphNodeSpec */
const paragraph = {
 group: 'block',
 content: 'inline*',
 parseDOM: [{
  tag: 'p'
 }],
 toDOM: () => ['p', 0]
}
/** textNodeSpec */
const text = {
 group: 'inline',
 inline: true
}

const nodes = {doc, paragraph, text};
const topNode = 'doc';

/** schema 用于定义文档模型的结构 */ 
const schema = new Schema({
 nodes,
 topNode
})
```
