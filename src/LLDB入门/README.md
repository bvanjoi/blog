# LLDB 入门

## 介绍

LLDB 是 LLVM 的调试工具

## 以一个文件开始

假如存在文件 `file.cpp`,

首先，需要编译生成可执行文件：`g++ file.cpp -o file`

随后，才能对其进行 GDB 调试。

## 调试之前

学会查看帮助：`lldb --help`.

## 启动

`lldb file` 表示开始调试 `file`.

## 断点

- `break file.c:12`: 在文件 `file.c` 的第 12 行添加断点。
- `break main`: 在函数 `main` 处添加断点。
- `breakpoint`: 