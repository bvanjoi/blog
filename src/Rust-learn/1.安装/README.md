# 从安装到 Hello World

## 介绍

受够了 `malloc` 与 `free`, 还有 `new` 与 `delete`.

不想去接触带有 GC 的 Java 与 Go.

*动态语言一时爽，代码重构火葬场*，因此告别赖以生存的 JavaScript 与 Python.

所以我想学 Rust, 一门又安全，又快的语言。

## 从安装开始

建议遵从[官网](https://www.rust-lang.org/tools/install)安装：

- 对于 macOS, Linux 或其他类 Unix 系统，可在终端输入：

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

- 对于 Windows 平台，可以在更多安装方式中的 *Other ways to install rustup* 来安装。

### 检查是否安装成功

首先，需要保证 Rust 工具链添加到环境变量中（这样可以保证全局使用 Rust 中的 CLI 指令）。（注意，这里可能是劝退的第一步，尤其是 Windows 下的同学）

随后，在终端输入：

```sh
rustc --version
```

如果输出正常，则安装成功。

### 我们安装了点什么

- rustc: Rust 编译器。
- rust-docs: 为 Rust 项目生成文档的工具。
- rust-std: Rust 标准库。
- rustfmt: 自动格式化 Rust 代码的工具。
- cargo: Rust 的构建系统与包管理工具。
- clippy: 一系列 linter 工具的集合，可以用来检查代码正确与否。

## 用什么写代码

本来想起小标题为 “IDE 选择”，但感觉 VSCode 不算 IDE, 所以还是舍弃了。

个人建议以下两种方式：

- VSCode + Rust 插件 + Code Runner 插件
- CLion + Rust 插件

## 再从 Hello World 出发

记得多年以前，刚上 C 语言课程的我们的第一份实验作业是手抄一份代码。

看起来很简答，当然也确实很简单。可是，一节课下来，依旧有很多同学没有办法将程序调通。

现在想来，原因有以下几个：

- 拼写错误：stdio 打成了 stido.
- 中英文混淆：; 打成了 ；.
- 初中英语没学好：true 打成了 ture.

时间荏苒，种种琐碎的过去早已忘记，可室友当时求助我时的汪汪大眼依旧记在心中。

所以，我也想用留下一段需要被抄写的代码：

```rust
fn main() {
  println!("Hello World!");
}
```

抄写过程：

1. 创建一个文件，名为 *main.rs*.
2. 抄写代码到其中，注意是抄写不是复制。
3. 打开命令行工具，切换到该文件所在的目录下。
4. 在命令行中输入 `rustc main.rs`.
5. 在命令行中输入 `./main`.
6. 最终，执行完第 5 步，输出 `Hello World` 即为成功。
