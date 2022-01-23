# Rust 中的内存泄漏

Rust 官网中明确指出：Rust 内类型系统和所有权模型保证了内存安全，但需要注意的是，内存安全并不能阻止内存泄漏，在 [The Rust Programming Language 15.6](https://doc.rust-lang.org/book/ch15-06-reference-cycles.html) 一节中，也展示了循环引用导致的内存泄漏问题。

本文将梳理 Rust 内的内存泄漏案例，诸如循环引用等，以及由此涉及到的一些数据结构。

## 循环引用的前置知识

由于 Rust 所有权设计，各种类型所对应实现的内存分配不同，因此诸如链表等数据结构实现起来比较复杂。

例如在 JavaScript 中，创建链表的思路很简单：

```js
function node(next) {
  this.next = next;
}
let a = new node(new node(null));
```

上述代码即创建了一个链表，其效果为：

![JavaScript 内实现链表](https://img-blog.csdnimg.cn/4e743603c0514199b97fc510cb1857cd.png)

而在 Rust 中，一切变的复杂起来。

### 最简单的写法

照搬上述代码逻辑到 Rust 中，其声明如下：

```rust
struct Node {
  next: Node
}
```

上述代码编译会报错，原因很简单：结构体 `Node` 内存在无限递归，编译期无法确定它在**栈**上所占据的内存空间，因此直接报错。（Rust 上内所有的值默认都是栈分配的）

### 将数据存在堆上

Rust 内置了一种数据结构 `Box`, 它是一种智能指针，可以将指定的值放到堆上，并在离开作用域阶段执行析构函数；`Option` 表示一种可以为空的指针，来表示链表的结束。

借助上述二者可以实现 `Node` 的声明：

```rust
struct Node {
  next: Option<Box<Node>>
}
```

下面尝试实现循环引用的代码：

```rust
fn main() {
  let mut a = Node {
    next: None
  };
  let mut b = Node {
    next: None
  };
  a.next = Some(Box::new(b));
  b.next = Some(Box::new(a));
}
```

编译上述代码，依然会得到报错：因为在 `a.next = Some(Box::new(b));` 一行中，变量 `b` 的所有权已经转交出去，进而导致下一行调用 `b.next` 失败。

因此 `Box` 内部的所有权机制并不能实现循环引用。

### 计数指针

例如图中，单个值可能会存在多个所有者，此时就需要使用 `Rc`(reference counting) 来启用多所有权。

来看下述示例：

```rust
use std::rc::Rc;

struct Node {
  next: Option<Rc<Node>>
}

fn main() {
  let a = Rc::new(
    Node {
      next: None
    }
  );
  let b = Node {
    next: Some(Rc::clone(&a))
  };
  let c = Node {
    next: Some(Rc::clone(&a))
  };
}
```

上述实例的结构也很简单，`b` 与 `c` 都指向了 `a`.

借助 Rc 实现的循环引用代码为：

```rust
fn main() {
  let d = Rc::new(
    Node {
      next: None
    }
  );
  let e = Rc::new(
    Node {
      next: None
    }
  );
  e.next = Some(Rc::clone(&d));
  d.next = Some(Rc::clone(&e));
}
```

但编译上述代码依然会报错，因为 `Rc` 只提供了数据的不可变访问。

### 内部可变性

Rust 内提供了 `RefCell` 来实现内部可变性（即不改变引用，仅仅改变引用指向的值）。

例如，对于下面代码，通过 `borrow_mut` 获取到可变引用，便可以对其进行修改。

```rust
fn main() {
  use std::cell::RefCell;
  let a = RefCell::new(1);
  *a.borrow_mut() = 2;
  println!("{}", a.borrow());
  // 2
}
```

### 析构 trait

Rust 内的 `Drop` trait 可以规定变量析构时的行为。

例如，当下列代码执行时，变量 `a` 所占据的内存空间在程序结束时被释放，进而触发 `Drop`, 最终输出 `drop 3`.

```rust
struct A {
  val: i32
}
  
impl Drop for A {
  fn drop(&mut self) {
    println!("drop {}", self.val);
  }
}
  
fn main() {
  let a = A { val: 3 };
}
```

## 循环引用带来的内存泄漏

至此，可以通过 `Rc` 搭配 `RefCell` 可以实现循环引用，来看以下代码：

```rust
struct Node {
  next: Option<Rc<RefCell<Node>>>
}

impl Node {
  fn new() -> Node {
    Node {
      next: None
    }
  }
}

impl Drop for Node {
  fn drop(&mut self) {
    println!("drop")
  }
}

fn main() {
  let node1 = Rc::new(RefCell::new(Node::new()));
  let node2 = Rc::new(RefCell::new(Node::new()));
  node1.borrow_mut().next = Some(Rc::clone(&node2));
  node2.borrow_mut().next = Some(Rc::clone(&node1));
  println!("done");
}
```

执行上述代码，最终结果只会输出一个 `done`, 这表明 `node1` 与 `node2` 并没有被释放，因此造成了内存泄漏。

## `std::mem::forget` 引起的内存泄漏

`mem::forget` 会让值放弃执行析构函数，例如执行下列代码，不会有任何输出。

```rust
fn main() {
  use std::mem;
  // A 的定义见上
  let b = mem::forget(A { val: 4 });
}
```

## `Box::leak` 引起的内存泄漏

`Box::leak` 将运行期的值的生命周期转化为 `'static`, 以保证值可以生存的更久，但是同时也会造成内存泄漏：

```rust
fn gen_static() -> &'static mut Vec<i32> {
  let a = Box::new(vec![1,2]);
  Box::leak(a)
}

fn main() {
  let f = gen_static();
  f[0] = 3;
  println!("{:?}",f); // [3,2]
}
```
