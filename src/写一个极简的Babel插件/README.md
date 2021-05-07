# 写一个极简的 Babel 插件

在 [Babel 入门](../Babel入门/README.md) 中，简单介绍了 Babel 的用法，本文将介绍如何编写一个 Babel 插件。

## 环境配置

为了使用 Babel 的 CLI 工具和核心服务，需要执行下列命令安装 Babel:

```sh
yarn add -D @babel/cli @babel/core
```

为了直观地感受 Babel 编译 JavaScript 源码的过程，需要执行下列命令：

```sh
yarn add @babel/parser @babel/traverse @babel/generator @babel/types
```

## 前置知识

为了理解 Babel 转译的过程，需要以下前置知识：

### AST

AST, Abstract Syntax Tree, 即抽象语法树，它是代码的一种表现形式。

例如，对于 JavaScript 代码：

```javascript
const a = 1;
```

可以使用下述代码，通过 Babel 来 parser 源代码，进而生成 AST:

```javascript
const babel = require('@babel/core');
const ast = babel.parse(`const a = 1`);
```

打印变量 `ast` 中的内容：

![ast](https://img-blog.csdnimg.cn/20210507235535543.png)

为了更加直观，将语法树中的 `Node` 类型都打印出来：

```js
console.log(ast.program.body)
console.log(ast.program.body[0].declarations)
```

结果为：

![body and declarations](https://img-blog.csdnimg.cn/20210507235845553.png)

简单整理，可以归纳 `ast` 的结构为：

```javascript
{
  type: 'File', // 文件节点
  program: {    
    type: "Program", // 程序节点
    body: [
      { //  第一行语句
        type: "VariableDeclaration", // 声明语句
        kind: "const",               // 声明类型
        declarations: [
          { 
            type: "VariableDeclarator",
            id: {
              type: "Identifier", // 变量类型
              name: "a",          // 变量名
            },
            init: {
              type: "NumericLiteral", // 值类型
              value: 1                // 值
            }
          },
        ]
      }
    ]
  }
}
```

### Stages of Babel

Babel 执行流程可以总结为三步骤：

1. 解析(Parse): 将源代码解析为词法单元，并据此生成抽象语法树；
2. 转换(Transform): 遍历抽象语法树，并处理相应的节点。babel-plugins 便是在这一阶段生效；
3. 生成(Generate): 依据处理好的 AST, 生成新的代码。

> 作为拓展，可以参考 [将 Lisp 函数转化为 C 类函数](../将Lisp函数转化为C类函数/README.md), 其中有上述流程的一份示例。

### API

- `@babel/parser`: 提供 API 来将源代码转化为 AST, 对应上述过程的解析阶段；
- `@babel/traverse`: 提供 API 来完成对 AST 的遍历；
- `@babel/types`: 负责 AST 的 Node 类型系统，具体可见：[Babel-parser 类型系统](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md)
- `@babel/generator`: 提供 API 来依据 AST 生成代码；

## 开发一款极简的 Babel 插件

下面，我们来开发一款 Babel 插件，其功能很简单：给所有的变量名前添加下划线，例如，对于变量 `x`, 经过 Babel 处理后的结果应该为 `_x`.

假设原始代码为：

```javascript
const a = 1;
const b = 2;
console.log(a === b);
```

### 使用 API 来开发

首先来使用 Babel 的几个库来开发：

```javascript

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const code = `
  const a = 1;
  const b = 2;
  a === b;
`;

// source code -> ast
const ast = parse(code);

// update
traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path)) {
      path.node.name = `_${path.node.name}`
    }
  }
})

const output = generate(ast);

console.log(output.code)
```

执行后，最终输出结果为：

```javascript
const _a = 1;
const _b = 2;
_a === _b;
```

### 使用 Babel transform

使用 API 来转译代码，虽然展示了 Babel 的执行流程，但是无法像 `@babel/preset-env` 一样配置成插件的格式。

首先来看 `@babel/core` 中的一个 API: `transform`:

```javascript
function transform(code: string, opts?: TransformOptions): BabelFileResult | null;
```

其中，参数 `code` 为源代码，`opts` 为相关配置文件，而在 `opts` 中有一个字段 `plugins`, 该字段便是插件。我们可以按其类型写一个实现 *给变量名加下划线* 的功能。

代码可以写做：

```javascript
const babel = require('@babel/core');

const code = `
  const a = 1;
  const b = 2;
  a === b;
`;

const output = babel.transform(code, {
  plugins: [
    {
      visitor: {
        Identifier(path) {
          path.node.name = `_${path.node.name}`;
        }
      }
    }
  ]
})

console.log(output.code)
```

> 其中，visitor 为访问者模式。

### 使用 Babel plugins

为了用上 plugins, 需要将 `transform` 中的功能部分抽成函数，并新建 `addUnderline.js` 文件， 其内容为：

```javascript
// addUnderline.js
module.exports = function addUnderline() {
  return {
    visitor: {
      Identifier(path) {
        path.node.name = `_${path.node.name}`;
      }
  }}
}
```

同时新建 `index.js` 文件：

```javascript
const a = 1;
const b = 2;
a === b;
```

新建配置文件 `babel.config.js`:

```javascript
const addUnderline = require('./addUnderline');

module.exports = {
  plugins: [addUnderline]
}
```

最后执行：

```sh
npx babel ./index.js
```

便可以在控制台看到相应的输出。

![output](https://img-blog.csdnimg.cn/20210508004556335.png)

## 后记

当然，上述过程仅仅是一个展示基本流程的示例，非常简单且错误百出（不信你将 `a === b;` 换成 `console.log(a === b);`试试），仅作为参考使用，根本无法投入生产。
