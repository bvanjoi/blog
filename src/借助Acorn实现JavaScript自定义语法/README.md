# 使用 Acorn 实现自定义 JavaScript 语法

Rust 中，诸如条件、循环语句中的判断表达式，可以省略括号：

```rust
if 1 > 2 {
} else {
}
```

当然，加上括号也可以编译通过，但是在静态检查阶段，编辑器会告知开发者：该表达式有多余的括号。

![rustc 的提示](https://img-blog.csdnimg.cn/20210522112457481.png)

该规则使得代码风格更加简介，深得许多开发者（我）的喜爱，为此，本文将借助 Acorn 解析器来扩展 JavaScript 语法，使得其兼容不带括号的条件判断语句。

为了方便，将扩展后的语法称为 opjs, 即 option-parentheses-JavaScript.

## 测试驱动开发

这里，我们采用测试驱动开发(TTD, Test-driven development)的方式，即先把预期的测试用例写出来，之后据此开发功能。

依据 opjs 的目标，可以设计出以下测试用例：

|opjs| javascript|
|-|-|
|`if 1 > 2 {} else if 2 > 2 {} else {}`   |`if (1 > 2) {} else if (2 > 2) {} else {}`|
|`let a = 2; while a > 0 {a-=1;}`         |`let a = 2; while (a > 0) {a-=1;}`|
|`const d = 2; switch d {case 1: default: break;}`                       |`const d = 2; switch (d) {case 1: break; default: break;}`|
|`do {} while 2 < 1`|`do {} while (2 < 1)`|
|`const add = (a,b) => a + b;`|`const add = (a,b) => a + b;`             |
|`function div(a,b) {return a - b;}`|`function div(a,b) {return a - b;}` |

> 由于 for-in, for-of, for 比较复杂，因此略过。

随后，引入三个库：

```bash
yarn add acorn jest escodegen
```

- `acorn`: 将 JavaScript 代码转化为 AST, 可以借助插件来实现自定义语法；
- `escodegen`: 将 AST 节点转化为 JavaScript 代码，可以借此来验证是否转换成功；
- `jest`: JavaScript 的测试框架。

随后，以 `if 1 > 2 {} else if 2 > 2 {} else {}` 为例，新建文件 `index.jest.js`, 其内容如下：

```js
const acorn = require('acorn');

const code = `if 1 > 2 {} else if 2 > 2 {} else {}`

describe("should parse", function() {
  it('should parse if-else', function() {
    //使用 acorn 自带的解析器来解析：
    expect(acorn.parse(code)).toMatchSnapshot()
  })
})
```

随后，运行 `npx jest`, 可以检查测试结果：

![词法分析失败](https://img-blog.csdnimg.cn/20210522122534322.png)

可以看到，其报错原因在于：“语法错误：遇到了不符合预期的词法单元”。

随后，检查其执行堆栈，可以看到，当执行 if 语句时，预期的词法单元为 `(`, 而该 token 并不存在。

![error stack](https://img-blog.csdnimg.cn/20210522124315878.png)

## 实现满足 opjs 的 Acorn 插件

下面来思考，如何实现 opjs.

首先，第一个想法：opjs 的语法属于自定义语法，并不符合 JavaScript 规范，因此解析失败的必然的。

其后，第二个问题：解析失败的具体原因是，当遇到诸如 if, else if, while, for, switch 等语句时，JavaScript 的语法解析器会期待下一个字符串为 `(`. 因此，只要跳过该预期，便可以正常执行。

随后，第三个问题：如何跳过 `(` 的预期？答案也很简单：编写 Acorn 插件，替换原有的解析规则。

> Acorn 是一款小巧的 JavaScript 解析器，诸如 Babel 在解析阶段也是依赖了 Acorn.

之后，第四个问题：如何编写 Acorn 插件？答案也很简单：进入 Acorn 在 Github 上的代码仓库, 阅读 README.md, 可以看到，作者已经给出了实现插件的方法：

![acorn/README.md/Plugin development](https://img-blog.csdnimg.cn/20210522123739964.png)

简而言之，可以通过覆盖 `Parse` 类中对应的函数，来实现所需功能。

而 `Parse` 中对应的函数，即为 `parseParenExpression`, 我们可以去掉括号检查的功能，为此，代码可以写成：

```js
const acorn = require('acorn');

const code = `if 1 > 2 {} else if 2 > 2 {} else {}`

function opPlugin(Parser) {
  return class extends Parser {
    parseParenExpression() {
      return this.parseExpression();
    }
  }
}

const opParse = acorn.Parser.extend(opPlugin)

describe("should parse", function() {
  it('should parse if-else', function() {
    expect(opParse.parse(code)).toMatchSnapshot()
  })
})
```

随后，执行：

```bash
npx jest
```

可以看到，转译通过。

![pass](https://img-blog.csdnimg.cn/20210522125629480.png)

另外，通过测试用例来看可能有些生疏，因此，可以使用 `escodegen` 生成 JavaScript 代码并运行，代码为：

```js
const jsCode = require('escodegen').generate(opParse.parse(code));
console.log('opjs code: \n', code)
console.log('\n javscript from opjs: \n', jsCode)

// 随后，使用 node -e 执行转换后的代码
const out = require('child_process').spawn('node', ['-e',jsCode])
out.on('close', (code) => {
  console.log('exit code:', code)
})
```

上述代码执行结果为：

![js from opjs](https://img-blog.csdnimg.cn/20210522131637654.png)

> 退出码 0 表示正常退出。

## 扩展到所有测试用例

篇幅有限，不再赘述。经过实际测试，诸如 if, if-else, while, do-while, switch 语句内的括号，是可以通过上述方法去掉的。
