# 将 Lisp 函数转化为 C 类函数

本文将使用 Rust 构建一款功能非常有限的编译器，它的唯一功能是将 Lisp 函数转化为 C 类语言函数。

假设事先约定函数 `add` 和 `sub`, 它们可以接受多个参数。首先，明确 Lisp 和 C 中的函数怎么写：

- Lisp 中：

  ```lisp
  (add 1 (sub 2 3))
  ```

- C 中：

  ```c
  add(1, sub(2, 3));
  ```

现在，我们编译器的功能就是将输入 `(add 1 (sub 2 3))` 的字符串转化为 `add(1, sub(2,3));`.

## 编译流程

大部分编译器的工作流程可以分为三个阶段：1. 解析；2. 代码转换；3. 最终代码生成。

- 解析(Parsing): 将字符串文本转化为抽象语法树(AST, Abstract Syntax Tree);
- 代码转换(Transformation): 对 AST 进行处理，生成需要的格式；
- 代码生成(Code Generation): 用处理后的 AST 生成新代码。

### 解析(Parsing)

Parsing 阶段可以包括为两部分：

1. 词法分析(Lexical Analysis): 将原本的代码分割为定义好的词法单元(token).
2. 语法分析(Syntactic Analysis): 将 tokens 生成

假设，我们输入的 Lisp 代码为 `(add 1 2)`.

首先，需要定义一系列词法单元的类型：

```rust
#[derive(Debug)]
/// 词法单元
pub enum Token {
    /// 括号类型
    Paren(char), 
    /// 数字类型
    Number(String),
    /// 函数类型
    Name(String),
}
```

> 在 `enum` 前加 `#[derive(Debug)]` 表示，可以自动地为 `Token` 创建 `fmt::Debug`, 会使得 `Token` 可以被打印。

随后，实现函数 `tokenizer` 来将输入的字符串转化为词法单元：

思考 `tokenizer` 的算法：

- 若遇到 '(' 或 ')', 则将其视为 `Token::Paren`;
- 若遇到 '0123456789' 中的任何一个，则 `Token::Number` 类型，同时，向前遍历，直到该数字结束；
- 若遇到 'a' ~ 'z' 中的任何一个，由于事先的约定，则必然为函数（事实情况远比这复杂），为 `Token::Name` 类型，同时，向前遍历，直到字符结束；
- 若遇到空白符号，则跳过；

```rust
/// 将输入的字符串转化为词法单元
pub fn tokenizer(input: &str) -> Vec<Token> {
    // 最终生成的词法单元
    let mut tokens: Vec<Token> = Vec::new();
    // 将输入转化为迭代器
    let mut chars = input.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            // 跳过空白符
            c if c.is_whitespace() => {}
            // 左右括号的处理
            '(' | ')' => tokens.push(Token::Paren(c)),
            // 若遇到数字，则走完该数字
            '0'..='9' => {
                let mut value = String::new();
                value.push(c);
                while let Some(&('0'..='9')) = chars.peek() {
                    value.push(chars.next().unwrap());
                }
                tokens.push(Token::Number(value));
            }
            // 若为字母，由于预先的约定，只可能是函数名（现实中远比这复杂）
            'a'..='z' => {
                let mut value = String::new();
                value.push(c);
                while let Some(&('a'..='z')) = chars.peek() {
                    value.push(chars.next().unwrap());
                }
                tokens.push(Token::Name(value));
            }
            _ => panic!("I don't know what this character is {}", c),
        }
    }
    tokens
}
```

之后，假如我们执行 `tokenizer("(add 1 2)")`, 打印返回的结果为：

```text
Paren('(')
Name("add")
Number("1")
Number("2")
Paren(')')
```

随后，考虑词法分析阶段，需要将生成的 `tokens` 转化为 `AST`.

首先，要明确一点：AST, 是一棵**树**。

所以，先要定义树中非根节点的类型：

```rust
#[derive(Debug)]
pub enum Expr {
    /// 数字
    NumberLiteral(String),
    /// 函数
    CallExpression(String, Vec<Expr>),
}
```

这里可以看到，树中节点已经去掉了括号，即没有 `Token::Paren`, 这是因为，树的结构已经可以表达先后关系。

之后，再定义树的根节点类型：

```rust
/// 程序的根节点
#[derive(Debug)]
pub struct Program {
    pub body: Vec<Expr>,
}
```

下面代码将展示如何把 `tokens: Vec<Token>` 转化为 `Program`:

```rust
/// 对于当前的词法单元，生成一个表达式
fn walk(tokens: &mut Peekable<IntoIter<Token>>) -> Expr {
    let token = tokens.next().unwrap();

    match token {
        Token::Number(value) => Expr::NumberLiteral(String::from(value)),
        Token::Paren(value) if value == '(' => {
            if let Some(next_value) = tokens.next() {
                match next_value {
                    Token::Name(name) => {
                        let mut params: Vec<Expr> = Vec::new();
                        while let Some(param) = tokens.peek() {
                            match param {
                                Token::Paren(paren) if paren == &')' => break,
                                _ => params.push(walk(tokens)),
                            }
                        }
                        tokens.next();
                        Expr::CallExpression(String::from(name), params)
                    }
                    _ => panic!("Expected CallExpression after ("),
                }
            } else {
                panic!("Expected CallExpression after (");
            }
        }
        _ => unreachable!(),
    }
}

/// 生成 ast
pub fn ast_from_tokens(tokens: Vec<Token>) -> Program {
    /// 将数组转化为可迭代值
    let mut tokens = tokens.into_iter().peekable();
    let mut body: Vec<Expr> = Vec::new();

    while let Some(_) = tokens.peek() {
        body.push(walk(&mut tokens))
    }

    Program { body }
}
```

简单陈述上面两个函数的作用：

- `ast_from_tokens`: 入参为 `tokens`, 通过 `walk` 生成一系列的节点，并将其存到 `body` 中。
- `walk`: 若当前的词法单元为数字(`Token::Number`)，则将其生成叶子节点并返回；若遇到左括号(`Token::Paren`), 则表明*下一个*词法单元为函数(`Token:Name`), 之后将其作为一个子树，开始下一轮的递归。

以 `(add 1 (sub 3 4))` 为例，当执行 `ast_from_tokens(tokenizer("(add 1 (sub 3 4))"))`，最终生成的语法树的样子类似于：

```txt
 Program.body
     |
    add
   /   \
  1    sub
      /   \
     3     4
```

### 转换(Transformation)

AST 的作用就是方便后期的处理，这里，我们需要将 Lisp 函数的语法树转化为 C 类函数的语法树。

首先要定义，C 类函数的 AST 应该为哪些类型：

```rust
#[derive(Debug)]
pub enum CExpr {
    /// 数字
    NumberLiteral(String),
    /// 表达式
    Statement(Box<CExpr>),
    /// 函数
    CallExpression(Box<CExpr>, Vec<CExpr>),
    /// 标识符
    Identifier(String),
}
```

随后，可以定义 C 函数的 AST 的根节点：

```rust
#[derive(Debug)]
pub struct CProgram {
    pub body: Vec<CExpr>,
}
```

之后，来看 lisp 函数的 AST 到 C 函数的 AST 的转换：

```rust
fn traverse_nodes(nodes: &Vec<Expr>, parent: Option<&Expr>) -> Vec<CExpr> {
    nodes
        .iter()
        .map(|elem| traverse_node(elem, parent))
        .collect()
}

/// 将当前 Lisp 节点转化为 c 节点
fn traverse_node(node: &Expr, parent: Option<&Expr>) -> CExpr {
    match node {
        Expr::NumberLiteral(value) => CExpr::NumberLiteral(value.to_string()),
        Expr::CallExpression(name, params) => {
            let call_expression = CExpr::CallExpression(
                Box::new(CExpr::Identifier(name.to_string())),
                traverse_nodes(params, Some(node)),
            );

            let statement = match parent {
                Some(&Expr::CallExpression(_, _)) => call_expression,
                _ => CExpr::Statement(Box::new(call_expression)),
            };

            return statement;
        }
    }
}

pub fn to_c_ast(ast: Program) -> CProgram {
    let body = traverse_nodes(&ast.body, None);
    CProgram { body }
}
```

- `to_c_ast`: 这里将 lisp 函数的 AST 作为入参传入；
- `traverse_nodes`: 将 AST 中某一层的节点依次处理；
- `traverse_node`: 对于 Lisp AST 中的某一个节点：若是数字，直接转化为 `CExpr::NumberLiteral`；若为函数，首先对所有孩子进行递归操作，将其转化为 `CExpr` 中的类型，最后，若该节点为根节点（具体而言为 `ast.body` 下的节点），则将其转化为 `CExpr::Statement` 类型；否则为 `CExpr::CallExpression`, 其中，`CExpr::Identifier` 对应`Token::Name`.

### 代码生成(Code Generation)

代码生成阶段，用 C 类的 AST 生成为代码字符串：

```rust
fn build_statement(node: &CExpr) -> String {
    match node {
        CExpr::Statement(expression) => build_statement(expression) + ";",
        CExpr::CallExpression(callee, argument) => {
            build_statement(callee)
                + "("
                + &argument
                    .iter()
                    .map(|arg| build_statement(arg))
                    .collect::<Vec<String>>()
                    .join(", ")
                + ")"
        }
        CExpr::Identifier(name) => name.to_string(),
        CExpr::NumberLiteral(value) => value.to_string(),
    }
}

pub fn c_ast_to_string(ast: CProgram) -> String {
    ast.body
        .iter()
        .map(|statement| build_statement(statement))
        .collect::<Vec<String>>()
        .join("\n")
}
```

- `c_ast_to_string`: 处理 C 类 AST 中的每个孩子。
- `build_statement`: 若遇到 `CExpr::Statement`, 则在最后加一个分号；若遇到 `CExpr::CallExpression`, 则在两侧加小括号，并将其参数以 `,` 分割；若遇到标识符和数字，则直接输出。

## 总结

综上，一个简易的编译器便构造完成了，参考 2 中还提供了一个 CLI 界面，其效果如下：

![输入 (add 1 (sub 23 45))](https://img-blog.csdnimg.cn/20210406172757703.png)

## 参考

1. <https://github.com/jamiebuilds/the-super-tiny-compiler>
2. <https://github.com/rvcas/the-super-tiny-compiler.rs>
