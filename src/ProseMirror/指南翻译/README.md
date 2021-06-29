# ProseMirror 指南

> 翻译自 <https://prosemirror.net/docs/guide>, 略有变动。

本指南用以描述 ProseMirror 项目下不同库的概念以及之间相互的联系。为了对 ProseMirror 有一份全景认知，建议按照顺序阅读该指南（最少读完 View 部分）。

## 介绍

ProseMirror 提供了一系列用以构建富文本编辑器的工具和概念，虽然受到了 所见即所得 思维的启发，但是也试图避免其中一系列的问题。

ProseMirror 的主要原则是让文档和事物完全受控于代码，此处的文档并不是杂乱无章的 HTML, 而是由开发者自定义的数据结构，所有的更新都必须经过一点，在这点处，可以由开发者进行处理。

同时，ProseMirror 的核心库并不是开箱即用的组件，我们认为组件化和可定制性由于简洁性，但同时我也希望，开发者可以给予 ProseMirror 来实现开箱即用的编辑器。

ProseMirror 中有四个最基本的模块：

- [prosemirror-model](https://github.com/ProseMirror/prosemirror-model): 定义编辑器的文档模型，所谓文档模型是指描述编辑器内容的数据结构；
- [prosemirror-state](https://github.com/ProseMirror/prosemirror-state): 描述编辑器状态的数据结构，包括选区、事物系统。
- [prosemirror-view](https://github.com/ProseMirror/prosemirror-view): 将给定的编辑器状态转化为浏览器中可编辑器元素，同时处理用户与之的交互。
- [prosemirror-transform](https://github.com/ProseMirror/prosemirror-transform): prosemirror-state 中事物系统的基类。

另外，还有一些基于核心模块实现的功能模块：[basic editing commands](https://github.com/ProseMirror/prosemirror-commands), [binding keys](https://github.com/ProseMirror/prosemirror-keymap), [undo history](https://github.com/ProseMirror/prosemirror-history), [input macros](https://github.com/ProseMirror/prosemirror-inputrules), [collaborative editing](https://github.com/ProseMirror/prosemirror-collab), [simple document schema](https://github.com/ProseMirror/prosemirror-schema-basic)...更多内容可以参考 [Github prosemirror organization](https://github.com/ProseMirror).

Prosemirror 并不是浏览器可以直接加载的脚本，这意味着开发者需要一些打包工具才能使用它。

### 我的第一个编辑器

像乐高一样得创建一个极简编辑器：

```js
import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView }  from "prosemirror-view"

// schema 用于定义文档模型的结构
let state = EditorState.create({schema})
let view = new EditorView(document.getElementById('editor'),  {state})
```

随后安装 `esbuild` 作为打包工具：`yarn add esbuild`, 并执行命令 `npx esbuild index.js --bundle --outfile=bundle.js --watch` 进行打包。

最后，创建 `index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <title>ProseMirror</title>
</head>
<body>
 <div>
  <div id="editor"></div>
 </div>
 <script src="./bundle.js"></script>
</body>
</html>
```

效果为：

![first editor](https://img-blog.csdnimg.cn/20210615175113514.gif)

> 更详细内容可见 [demo](../demo/)

目前而言，该编辑器并不实用，例如，按下 Enter 后，并没有预期的换行。因为在核心模块中，并没有实现响应输入行为。

### Transactions

当用户输入时，或者说与 view 交互时，会产生一个 state transactions, 这是指用户输入时 ProseMirror 不仅仅只修改 document 的内容，还会修改编辑器的 state.

事实上，任何改变都会创建一个 transaction, 它用于描述变化，这些变化可以创建出新的 state, 随后这个新的 state 被用来更新 view.

开发者可以在 plugin 或 view 中定义 transaction, 例如：

```js
- let view = new EditorView(document.getElementById('editor'),  {state})
+ let view = new EditorView(
+  document.getElementById('editor'), 
+  {
+   state,
+   dispatchTransaction(transaction) {
+     console.log("Document size went from", transaction.before.content.size,
+                "to", transaction.doc.content.size)
+     let newState = view.state.apply(transaction)
+     view.updateState(newState)
+   }
+  }
+ )
```

效果为：

![transactions 效果](https://img-blog.csdnimg.cn/20210615185921315.gif)

### Plugins

Plugins 被用来以不同的方式扩展编辑器行为和状态。

例如，ProseMirror 官方提供了 `keymap`（绑定输入的行为） 和 `history` 插件（实现撤销/回退操作），可见下列代码：

```js
- let state = EditorState.create({schema})
+ import { undo, redo, history } from "prosemirror-history"
+ import { keymap } from "prosemirror-keymap"
+ let state = EditorState.create({
+  schema,
+  plugins: [
+   history(),
+   keymap({"Mod-z": undo, "Mod-y": redo})
+  ]
+ })
```

可见，在编辑器 state 创建阶段，将 plugin 诸如其中，随后便可以用 `ctrl-z`(`cmd-z` on MacOS)实现撤销.

### Commands

上文中 `undo`, `redo` 即为 `Command` 类型的函数，大多数的编辑行为会被绑定到键、菜单上。

ProseMirror 官方提供了一套基础的 键-命令 的集合：

```js
+ import {baseKeymap} from 'prosemirror-commands';
  plugins: [
   history(),
   keymap({"Mod-z": undo, "Mod-y": redo}),
+  keymap(baseKeymap)
  ]
```

随后，便可以执行回车换行等操作。

### Content

`EditorState` 对象下包含 `doc` 字段，该字段为一个只读属性，表示当前文档的内容。

## Document

在 ProseMirror 中，用于可以依据 prosemirror-model 中的 `NodeSpec` 来定义 document 数据结构。

### Structure

首先要定义的是 文档（Document）的模型，document 是一个 `Node` 对象，其中包含了一个 `Fragment`, 所谓 `Fragment`, 是指包含多个 `Node` 的数据结构。

这看起来像是浏览器 DOM, 虽然 ProseMirror 中也是以树状递归来存储 Node, 但是对于 **内联元素** 而言，二者有些不同：

HTML 中的 p 标签可能是以下结构：

```html
<p>
 This is
 <strong>
  strong text with
  <em>
  emphasis.
  </em>
 </strong>
</p>
```

但是在 ProseMirror 中，内联元素是一个扁平的序列，样式 `Mark` 作为 Metadata 信息附着之上：

```txt
node: paragraph
      -----------
text: This is strong text with emphasis.
      -------|----------------|------------
mark:         strong           strong, em
```

上述方式的优点有：1. 内联元素中允许使用位移来表示位置；2. 更加方便地处理 splitting（诸如换行）、改变样式等操作；3. 这意味着 document 只有一个有效的表示。

> document 只有一种有效的并表示指：不会出现无法区分 `<p><s><i>a</i></s></p>`, `<p><i><s>a</s></i></p>` 的情况，因为在创建 EditorState 时 Mark 是被有序添加到 Schema 中的。

综上，ProseMirror 的 document 是一个 node 树，其中，绝大部分叶子 node 为 textblock（仅仅包含 text），当然，也有一些叶子 node 内容为空，例如 `hr` 或 `video`.

同时，`Node` 对象中有一些反应作用的属性：

- `isBlock`: 是否为块，例如：

 ```js
 // the type of doc is NodeSpec, and others too.
 const doc = {
  // 这意味着 doc 内容为 block+
  content: 'block+'
 }
 ```

- `isLine`: 是否为内联，例如：

 ```js
 // ProseMirror 中必须实现的 node
 const text = {
  // 内部只能有内联元素，例如文字
  group: 'inline'
 }
 ```

- `isInlineContent`: 该 node 是否只能包含 inline content（疑似废弃？从位用到过）

- `isTextblock`: 该 node 是否包含 inline content, 例如：

 ```js
 const paragraph = {
  content: 'inline*',
  group: 'block'
  parseDOM: [{tag: 'p'}],
  toDOM() {return ['p', 0]}
 }
 ```

- `isLeft`: 该 node 是否不包含任何 content, 例如：

```js
const horizontal_rule = {
 group: 'block',
 parseDOM: [{tag: 'hr'}],
 toDOM() {return ['hr']}
}
```

### Identify and persistence

DOM 与 ProseMirror 文档还有一个不同：`nodes` 对象的表示方式。

- DOM 中，nodes 是带有 identity 的 mutable 对象，这意味着一个 node 只能出现在它的父级 node 下。
- ProseMirror 中，nodes 仅仅是一个值（即它是 immutable 的），同时，它可以出现在不同的数据结构中。

例如，数值 3 是一个值，它可以出现在任何算式中，对其进行 +1 操作，得到结果 4，但是值本身不发生变化。

ProseMirror 中 node 就采用这样的机制，它的值不会改变，且 document 下的 node 可能出现在多个 document 中，也有可能在一个 document 下出现多次。

同时，这也意味着，每次更新 document, 将会产生一个新的 document 值，新 document 与旧 document 共享一些 nodes, 这样时间复杂度非常低。

上述机制有很大的优点：1. state 更新时编辑器始终可用，因为新的 state 就代表了新的 document； 2. 新旧 state 可以快速切换，这是协同办公的基础；

但是，由于 `nodes` 本质上是 JavaScript 对象，同时，由于 `Object.freeze()` 存在一定的性能问题，因此，事实上是可以强行改变它们的，但是 ProseMirror 并不支持这样做，强行修改 node 会导致一系列潜在的问题。

同样，不要修改诸如 node attributes 对象等等。

### Data structure

document 的数据结构如下图：

```text
Doc:
 type:      NodeType
 content:   [Node, Node, ...]
 attrs:     Object
 marks[inline node]: [{type:MarkType, attrs: Object}, ...]
```

其中：

- Doc 本身为一个 `Node`, 默认情况下，它被 `schema` 视为必须实现的 `topNode`.
- 每一个 `node` 为 `Node` 实例；`content` 类型为 `Fragment`; `attrs` 表明该节点的属性，例如，图片节点需要 URL.
- marks 适用于 **内联节点**, 例如 link 的 href.

### Indexing

ProseMirror 支持两种索引系统：

- 树状。使用 offset 来区分每个 node. 该方法中，可以通过 `child`, `descendants`, `foreach` 等来查找需要的 node.
- 扁平结构。该方法中，可以用下标来寻找到确切的位置：

 ```txt
 0   1 2 3 4    5
  <p> a b c </p>
5            6    7 8 9 10    11   12            13
 <blockquote> <p> o  n e  <img> </p> </blockquote>
 ```

每一个 node 都有 `nodeSize` 属性，该属性给出了整个节点的大小；`node.content.size` 可以获取内容大小。

手动计算这些位置需要大量计算工作，因此可以调用 `Node.resolve` 来获得一个 `position` 的更多描述，该描述包括当前 position 的父亲 node 是什么、它在父亲 node 中的偏移量是多少等等。

同时，ProseMirror 中还支持 `depth` 的概念.

```txt
0   1 2     3
0   1       0
 <p> a </p>

3   4 5     6
0   1       0
 <p> b </p>
```

### Slice

对于诸如复制、粘贴，拖拽、移动等操作，涉及到 Slice 的概念：它是指两个下标之间内容。

注意，Slice 并不是 Fragment, 例如，一个 Fragment 为 `<p>123</p><p>45</p>`, 而 Slice 可能为 `23</p>45`.

### Changing

由于 nodes 和 Fragment 为 persistent, 因此我们不能改变他们。因此，某个 document 应该永远保持不变。

多数情况下，可以使用 `transformations` 来更新 document, 这可以留下来一个变化记录。

某些情况下，若必须要手动更新 document, ProseMirror 在 `Node` 和 `Fragment` 上提供了一些有用的函数，诸如 `Node.replace`....

## Schema

Schema 约束了 node 和 mark 的行为，例如 doc 中要包含哪些 block, paragraph 中包含哪些 inline node, inline node 又可以被哪些 mark 装饰。

### NodeType

每个 node 都有一个 `NodeType`, 我们可以通过 `new Schema(nodes: {[name: string]: NodeSpec})` 的方式为每个 `name` 生成 `NodeType`.

例如：

```js
import { Schema } from 'prosemirror-model';

const schema = new Schema({
 nodes: {
  // 每一个 Schema 要求存在一个 top-level node, 默认情况下为 doc
  doc: {
   // content 内容为正则表达式
   // 也支持序列的写法
   // 例如 'heading paragraph+'
   content: 'block+'
  },
  paragraph: {
   // group 意味着当前 node 放到 content 包含该 group 的 node 中
   group: 'block',
   content: 'text*',
  },
  blockquote: {
   group: 'block',
   // 建议为所有块状元素设置为至少一个孩子节点
   content: 'block+'
  },
  // ProseMirror Schema 要求必须存在 text 节点
  text: {
   inline: true
  }
 }
})
```

> Schema.nodes 书写顺序非常重要，例如，doc 的第一个孩子为 paragraph, 这是因为 block 中第一个出现的 node 为 paragraph.

### MarkType

mark 为内联元素增加了样式信息, 我们可以通过 `new Schema(marks: {[name: string]: MarkSpec})` 的方式为每个 `name` 生成 `mark`.

例如：

```js
const schema = new Schema({
 nodes: {
  doc: {content: 'block+'},
  paragraph: {
   group: 'block',
   content: 'text*',
   // '_' 表示支持所有 mark
   marks: '_'
  },
  heading: {
   group: 'block',
   content: 'text*',
   // '' 表示所有 mark 都不支持
   marks: ''
  },
  text: {
   inline: true
  },
 },
 marks: {
   strong: {},
   em: {}
  }
})
```

### Attributes

每个 `node`, `mark` 都有 `attrs` 字段，该字段可用来存储额外的数据。

例如，对于 `heading`, 可以使用 `attrs` 来标注级别：

```js
const heading = {
 attrs: {
  level: {
   // 每次创建 heading 时，
   // 若没有明确指定 level 值，则 level 值为 1
   default: 1
  }
 },
 context: 'text*',
 parseDOM: [
  {
   // 遇到 h1 标签则解析为 {level: 1}
   tag: 'h1',
   attrs: {
    level: 1
   }
  }
 ],
 toDOM: (node) => {
  const {level} = node.attrs;
  return [`h${level}`, 0] // 0 表示 node 内部是有内容的
 }
}
```

### Serialization and Parsing

ProseMirror 的文档模型介于 DOM 与用户之间，因此，ProseMirror 需要解析 DOM(parseDOM) 和映射到 DOM(toDOM) 的配置。

> 可见上述 heading 的配置

### Extending a schema

TODO:

## Documents transformations

ProseMirror 中事物系统 transform 记录了 old state 到 new state 的变化。

### Steps

ProseMirror 中使用 `Step` 来描述文档的更新（虽然绝大部分情况下不要与此打交道）

例如：

当文档是 `<p>hello</p>` 时，

则有：

![状态1](https://img-blog.csdnimg.cn/20210616143642709.png)

此时索引为：

```txt
0   1 2 3 4 5 6    7
 <p> h e l l o </p>
```

此时，可用 `Step` 来删除 `ell` 字符：

```js
const step = new ReplaceStep(2, 5, Slice.empty);
const result = step.apply(view.state.doc);
```

随后有：

![Step 处理后](https://img-blog.csdnimg.cn/20210616144357960.png)

但是，`Step` 也有一个问题：它并不会检查是否满足 schema 的约束，对于上文，如果删除区间为 [0, 5], 则会返回一个失败的 `StepResult`:

```js
const step2 = new ReplaceStep(0, 5, Slice.empty);
failedResult = step2.apply(view.state.doc);
```

![failed stepResult](https://img-blog.csdnimg.cn/20210616144615725.png)

### Transforms

某个编辑行为可能会产生多个 step, 最方便的方式是使用 `Transform` 或 `Transaction`.

```js
const tr = new Transform(view.state.doc);
tr.split(2);
```

结果为：

![Transform 结果](https://img-blog.csdnimg.cn/20210616144912498.png)

### Mapping

当 document 发生变化时，给定的 position 上的文档信息可能会发生变化

例如，如果插入一个字符，则字符之后的所有字符都会指向一个新的 position, 该新的 position 的值为旧 position + 1.

同时，document 变化时需要经常保持 position, 例如 selection 的 from 和 to, 为此，可以使用 `map`:

```js
const step3 = new ReplaceStep(2,6, Slice.empty);
// 相当于
// 0   1 2 3 4 5 6    7
//  <p> h e l l o </p>
// ->
// 0   1  2    3
//  <p> h  </p> 
const map = step.getMap();
console.log(map.map(6)) // 输出为 3, 表明之前的位置 6 处于现在的位置 3
console.log(map.map(2)) // 2
console.log(map.map(1)) // 1
```

还有一个问题，如果把某个位置切开，则那么该位置应该放到切开后，还是切开前？

例如：

```js
const tr2 = new Transform(state.doc);
// 0   1 2 3 4 5 6    7
//  <p> h e l l o </p>
tr2.split(3)
// 0   1 2 3    4   5 6 7 8    9
//  <p> h e </p> <p> l l o </p>

console.log(tr2.mapping.map(7)) // 9
console.log(tr2.mapping.map(3)) // 5
console.log(tr2.mapping.map(3, -1)) // 3
```

### Rebasing

TODO:

## The editor state

当前 document, selection 等组成编辑器状态 state.

### Selection

`selection` 是 `Selection` 的实例，同 node 一样，selection 也是 immutable 数据。

ProseMirror 支持多种类型的选区：

- from: 较小位置；to: 较大位置；anchor: 锚点，选区中不变的点；head: 焦点，选区中变化的点；
- TextSelection, NodeSelection, AllSelection.
- 自定义选区。

### Transaction

新的 state 是由旧的 state 变化而来的，transaction 搭起二者的桥梁

> 当然，也有一些 state 是凭空产生的，例如，读取草稿箱内容而生成的 state.

```js
const { tr: tr3 } = state;
tr3.insertText('world');
newState = state.apply(tr3)
```

![newState](https://img-blog.csdnimg.cn/20210616151312636.png)

> 在段前插入是因为光标位于行首。

`Transaction` 继承自 `Transform`, 它继承了更新 document 的方法。

### Plugins

当创建新的 `EditorState` 时，可以提供一系列的 `plugin`, 这些 `plugin` 被存储在 `state` 中，他们的作用是影响 `tr` apply 的方式。

例如：

```js
const myPlugin = new Plugin({
 // plugin 自己的 immutable 数据
 state: {
  init() {
   return 0;
  },
  apply(tr,value) {
   return value + 1
  }
 },
 props: {
  // 可以传入 DOM 事件等
  handleKeyDown(view) {
   console.log('keydown');
   return false; // 不拦截事件
  }
 }
})

let state = EditorState.create({schema, plugins: [myPlugin]})
```

## The view component

ProseMirror 中的 `EditorView` 负责将 `state` 展示给用户，同时允许用户对其进行编辑操作；

### Editable DOM

- 输入事件是交给浏览器处理，因为干涉输入事件，会导致诸如拼写检查、头字母大写等不可用，当浏览器更新 DOM 时，ProseMirror 会检测到 DOM 变化，并对变化的部分进行序列化处理，然后把变化部分转化为 transaction.
- 其余大多数时间允许被用户直接处理，然后再用 ProseMirror 的数据模型重新解释一边。例如 Selection, 用户改变光标后，浏览器选区发生变化，随后 ProseMirror 内部与之对其；例如粘贴，粘贴内容被转化为 ProseMirror 的 Slice, 之后被插入到文档中。

### Data flow

```txt
       DOM event
      /         \
     /           \
    /             \
EditorView     Transaction
    \             /
     \           /
      \         /
      new EditorState
```

拦截 `Transaction` 是可行的：

```js
// The app's state
let appState = {
  editor: EditorState.create({ schema }),
  score: 0
}

let view = new EditorView(document.body, {
  state: appState.editor,
  dispatchTransaction(transaction) {
    update({type: "EDITOR_TRANSACTION", transaction})
  }
})

// A crude app state update function, which takes an update object,
// updates the `appState`, and then refreshes the UI.
function update(event) {
  if (event.type == "EDITOR_TRANSACTION") {
  appState.editor = appState.editor.apply(event.transaction)
 }    
  else if (event.type == "SCORE_POINT") {
  appState.score++
 }
  draw()
}

// An even cruder drawing function
function draw() {
  document.querySelector("#score").textContent = appState.score
  view.updateState(appState.editor)
}
```

### Efficient updating

TODO:

### Props

- `Plugin` 中的 props.
- `EditorView` 中的 props.

> EditorView 中的 Props 优先被处理，Plugin 中按注册顺序处理。

### Decorations

- `NodeDecorations`: 将样式或者其他 DOM 属性添加到单个 node 的 DOM 上；
- `WidgetDecorations`: 插入一个 DOM 节点，但并不是文档的组成部分；
- `InlineDecorations`: 增加样式或者属性，只针对内联元素。

当存在多个 `Decorations` 时，每次检测都会在内存中重新生成一个 `Decorations`, 该行为比较费时，建议将其放到 `Plugin` 的 state 中，然后当文档修改时再映射到当前状态

### NodeViews

TODO:

## Commands

TODO:

## Collaborative editing

TODO:

### Algorithm

TODO:

### The Authority

TODO:

### The `collab` Module

TODO:
