# 编译流程概览

编译器可以大致分为两个部分：前端、后端。

- 前端：负责词法分析、语法分析等；
- 后端：构建目标代码。

流程：

```txt
Character Stream                        ---------------
  |                                     | Symbol Table |
  |  Lexical Analyzer                   ---------------
  \/
Token Stream
  |
  |  Syntax Analyzer
  \/
Syntax Tree
  |
  |  Semantic Analyzer
  \/
Syntax Tree
  |
  |  Intermediate Code Generator
  \/
Intermediate Representation
  |
  |  Machine-Independent Code Optimizer
  \/
Intermediate Representation
  |
  | Code Generator
  \/
Target-Machine Code
  |
  |  Machine-Dependent Code Optimizer
  \/
Target-Machine Code
```

按照上述流程，代码 `p = i + v * 60` 被编译器处理过程如下：

```txt
p = i + v * 60                                      ---------------
  |                                                 | Symbol Table |
  |  Lexical Analyzer                               ---------------
  \/                                                | 1. p         |
                                                    ---------------
<id, 1> <=> <id, 2> <+> <id, 3> <*> <60>            | 2. i         |
  |                                                 ---------------
  |  Syntax Analyzer                                | 3. v         |
  \/                                                ---------------

    =
 /      \
<id,1>    +
        /    \
      <id,2>   *
              /   \
           <id,3>  60

  |
  |  Semantic Analyzer
  \/

    =
 /      \
<id,1>    +
        /    \
      <id,2>   *
              /   \
           <id,3>  int_to_float
                     |
                     60

  |
  |  Intermediate Code Generator
  \/

t1 = int_to_float(60)
t2 = id3 * t1
t3 = id2 + t2
id1 = t3

  |
  |  Machine-Independent Code Optimizer
  \/

t1 = id3 * 60.0
id1 = id2 + t1

  |
  | Code Generator
  \/

LDF   R2, id3
MULF  R2, R2, #60.0
LDF   R1, id2
ADDF  R1, R1, R2
STF   id1, R1
```

1. 词法分析阶段，将 `p` 映射为词法单元 `<id, 1>`, 其中 `id` 表示表示符，`1` 表示 `p` 在符号表中的位置；对于其他内容，诸如操作符 `+`, 变量 `60`, 均转化为相应的词法单元。
2. 语法分析阶段：将词法单元转化为**抽象语法树**。
3. 语义分析阶段：类型检查、一致性检查等。
4. 中间代码生成阶段：用以更方便地生成目标语言。
5. 中间代码优化：提高中间代码性能。
6. 代码生成：生成目标语言代码。
7. 符号表管理：符号表中存储了变量类型，作用域等信息。
