# Rust 内的 Trait: 定义共享行为

Rust 中 Trait 是指多种数据类型的公共属性或方法。

例如，对于 `String` 或者 `Vec` 类型，均具有 clone 方法：

```rust
(vec!['a']).clone();
String::from("abc").clone();
```

此时，`clone` 就是 `Clone` trait 提供共性属性。

## Trait 的用法

本节通过示例来说明 Trait 的使用，例如，`Action` 是一种 `Trait`:

```rust
trait Action {
  // 默认实现的方法
  fn eat() {
    println!("eating.");
  }
  // 方法签名
  fn call();
}
```

随后，定义结构体 `Cat` 和 `Dog`, 它们具有 `Action` 共性：

```rust
struct Cat {}
impl Action for Cat {
  // 对于只定义了函数签名的函数
  // 必须实现
  fn call() {
      println!("mew");
  }
  // 没有冲仔 eat, 则使用 `Action` 内默认实现
}


struct Dog {}
impl Action for Dog {
  // 重载 eat 函数
  fn eat() {
    println!("dog is eating.");
  }
  fn call() {
    println!("dark");
  }
}
```

## 孤儿规则(Orphan Rule)

Rust 对 Trait 有一个要求：当为某类型实现某 tarit 时，必要求该类型或者该 trait 至少有一个是在当前 create 中定义的，即，不能为第三方类型实现第三方的 trait.

上述要求是为了实现 Rust 类型推断。

## 常见的 Trait

- Deref
- Drop
- Debug
- PartialEq, Eq
- PartialOrd Ord
- Clone COpy
- Default
- Hash
