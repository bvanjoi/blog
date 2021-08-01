# Rust 的编译期计算

## 什么是编译期计算

首先明白什么是编译：编译是将语言翻译成另外一种语言的程序。

编译期计算是指，在编译过程中，将未知的量求解出来，而不在运行时求解。

## 编译期计算示例

举一个笼统点的例子：以 webpack5 打包 JavaScript 代码作为示例：

```js
// js 代码
const add = (a, b) => a + b;
const c = add(1,2);
console.log(c);
```

用 webpack5 的生产环境打包上述代码，其结果为：

```js
console.log(3);
```

可见，在 webpack5 打包的过程中，上述结果就已经被计算了，这就是编译期计算。

## Cpp 中的编译期计算

得益于 Cpp 模板的图灵完备性，理论上，Cpp 的模板系统可以在编译期间完成任何计算任务，例如：

```cpp
#include <iostream>

template <int n>
struct fact {
    static const int value = n * fact<n - 1>::value;
};

template <>
struct fact<0> {
    static const int value = 1;
};

int main() {
    int result = fact<10>::value;
    std::cout << result << std::endl;
    return 0;
}
```

执行 `g++ a.cpp -S` 后生成的汇编文件中，计算结果已经以常量的形式存在：

![Cpp 模板的编译期计算](https://img-blog.csdnimg.cn/323c8b28012e4d91958c70b5e0197780.png?)

## Rust 中的编译期计算

Rust 的 `const fn`关键字也提供了相应的编译期计算特性，还是以阶乘运算为例：

```rust
const fn factorial(n: i64) -> i64 {
  if n <= 1 {
   1
  } else {
   factorial(n - 1) * n
  }
}
const K: i64 = factorial(10);
fn main() {
 // dbg! 是 调试宏
  dbg!(K);
}
```

执行 `rustc ./main.rs --emit mir` 后生成的 mir 代码中存在：

![Rust 的编译期计算](https://img-blog.csdnimg.cn/2ec6e3aaec2f4231a30af26aec41dac4.png)

3628800 是 10! 的值，可见，Rust 也进行了编译期优化。

## 最后的思考

1. 编译期计算是怎么实现的？
2. 能否在前端项目中的打包阶段引入编译期计算，以实现 no runtime?
