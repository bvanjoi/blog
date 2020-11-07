# 十五分钟学 Rust

[上一节](../1.安装/README.md)给出了以下示例：

```Rust
fn main() {
    println!("Hello World!");
}
```

从上述代码中，可以了解到关于 Rust 的一些信息：

1. 程序入口为 `main` 函数。
2. 每条语句以分号结尾。
3. `println!` 是输出语句。
4. `fn` 用来声明函数
5. ....

本节中，我们简单介绍一些 Rust 的通用编程概念。假定你有一些编程基础，那么 15 分钟了解到这些不成问题。

## 注释

Rust 中注释有三种：

- 单行注释
- 多行注释
- 注释文档

```Rust
/// 这是注释文档
//! 这也是注释文档
fn main() {
    // 这是单行注释
    /* 这是多行注释的单行形式 */
    /**
     * 这是多行注释
     */
    println!("Hello, World");
}
```

其实，Rust 作为一门现代语言，注释所能提供的功能非常丰富，甚至在**注释文档**中，还支持 markdown 标记，也支持对文档中的示例代码进行测试，也可以使用 rustdoc 工具生成 HTML 文档。

## 变量

> 注该小节的所有修改均均处于 `main`  函数中。

Rust 中遵从 let-binding 规范，所以，创建一个变量的方式是使用 `let`.

```Rust
// 创建一个变量
let a = 1;
```

我们知道，Rust 是静态类型语言，因此变量 `a` 通过类型推断而获取了类型。

当然，也可以使用 `:` 来显示地指定类型：

```Rust
// 创建一个类型为 i64 的变量
let b:i64 = 2;
```

但是，这里有一个问题需要注意：Rust 中，单纯使用 `let` 声明的变量是**不可变**的，即：

```Rust
let c = 3;
c = 4;
// error: cannot assign twice to immutable variable
```

如果想要创建一个可变类型的变量，则需要使用 `mut` 关键字：

```Rust
let mut c = 3;
c = 4;
println!("c = {}", c);
// output: c = 4
```

当然，Rust 也提供了 `const` 来定义常量：

```Rust
const d = 4;
```

而关于 `const` 与 `let` 的不同之处，这里不再提及。

还有，Rust 提供了一种隐藏机制，例如：

```Rust
let e = 5;
let e = 6;
```

上述语法在 Rust 中是被允许的，`let e = 6;` 意味着：声明一个**新**的变量 `e`, 其值为 `6`, 而之前值为 `5` 的 `e`, 已经被隐藏了。

## 类型

在*变量*一节中，我们已经提及 Rust 是静态类型语言。

- 静态类型：编译期间，即需要知道变量的具体类型。

在 Rust 中，含有：

- 四种标量类型：1. 整型；2. 浮点型；3. 布尔型；4. 字符型；
- 两种复合类型：1. 元组；2. 数组。

```Rust
let _int8:i8 = 1;        // 8 位有符号整数
let _unsigned8:u8 = 2;   // 8 位无符号整数
let _int16:i16 = 3;      // 16 位有符号整数
let _unsigned16:u16 = 4; // 16 位无符号整数
let _int32:i32 = 5;      // 32 位有符号整数，默认
let _unsigned32:u32 = 6; // 32 位无符号整数
let _int64:i64 = 7;      // 64 位有符号整数
let _unsigned64:u64 = 8; // 64 位无符号整数
let _int128:i128 = 9;    // 128 位有符号整数
let _unsigned128:u128 = 10; // 128 位无符号整数
let _iint: isize = 11;   // 有符号整数，长度取决于运行平台
let _uint: usize = 12;   // 无符号整数，长度取决于运行平台
let _float32:f32 = 13.0; // 32 位浮点数
let _float64:f64 = 14.1; // 64 位浮点数，默认
let _bool:bool = true;   // 布尔类型
let _char:char = 'a';    // 字符类型，Rust 中使用 UTF-8 编码，而不是 ASCII
let _tup: (i32, f64, bool) = (1,2.0,false); // 元组
let _nums:[u8;5] = [0,1,2,3,4]; // 数组
```

## 控制流

在介绍这一部分之前，首先介绍**表达式**与**语句**的不同。

- 表达式：执行并产生一个值作为结果。例如，`5+6` 是一个表达式，其结果为 `11`.
- 语句：执行但是没有返回值。例如，`let x = (let y = 1);` 是**错误**的写法，`let y = 1` 是一个语句没有返回值。

示例：

```Rust
fn main() {
    let y = 2;
    let x = { // 这是 一条语句，最终的值为表达式 y 的结果
        let y = 1; // 块级作用域
        y          // 一个表达式
    };
    println!("{}", x); // 1
}
```

### if 表达式

Rust 中 `if` 表达式如下：

```Rust
fn main() {
    let num = 1;
    if num > 1 {
        println!("num is less 1");
    } else {
        println!("num is ge 1");
    }
}
```

### 循环语句

Rust 提供了三种循环：

- `loop`: 用法：`loop {}` 一直循环，直到遇到显式的退出。
- `while`:

```Rust
fn main() {
    let mut num = 0;
    while num < 10 {
        num = num + 1;
    }
}
```

- for 循环：

```Rust
fn main() {
    let arr = [1,2,3,4];
    for it in arr.iter() {
        println("{}",it);
    }
}
```

## 函数

从之前的内容可以了解到：`main` 函数是程序的入口，关键字`fn` 可以声明函数。

下面，来介绍另外一个函数：

```Rust
fn main() {
    println!("{}", fib(10)); // 55
}

fn fib(n:i32) -> i32 {
    if n <= 0 {
        return 0;
    }
    if n == 1 {
        return 1;
    }
    return fib(n-1) + fib(n-2);
}
```

以上是 Rust 函数中最基本的用法，括号内是传入的参数，`->` 后是返回类型，大括号内是函数体。

当然，Rust 函数还能涉及到其他许多语法：

- 函数嵌套：Rust 中允许函数嵌套。

```Rust
fn main() {
    fn get_five() -> i32 {
        5 // 与表达式
    }
    println!("{}", get_five()); // 5
}
```

- 宏与函数不同，例如`println!()`是一个宏，在 Rust 中，所有的宏都以 `!` 作为结尾。

---

以上，就是一些通用编程概念在 Rust 中的展示。

接下来的章节，我们会用更多的示例来展示 Rust 的特性，并期待用 Rust 书写更多的项目。
