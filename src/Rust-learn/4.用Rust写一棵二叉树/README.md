# 用 Rust 写一棵二叉树

## 树概览

计算机科学中，树是一种可由递归定义的数据结构，它有一个根节点，根节点下包含若干个子树。

当使用孩子兄弟表示法时，每棵树都可以转换为二叉树，因此，一般使用二叉树。

## 二叉树概览

二叉树有一个根节点，根节点下最多有两个孩子，分别为左孩子、右孩子。

> 二叉树属于最基本的数据结构之一，此处并不关心其性质、特点等，更多地关注点在于 Rust 实现。

## 算法实现

不同于其他语言，由于所有权的特性，Rust 在这类数据结构的实现上有些复杂。

例如，在 JavaScript 中，我们可以非常轻易地构造一棵树：

```javascript
/** 树节点结构 */
class TreeNode {
  constructor(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/** 构造值为 1, 左孩子、右孩子均为空的节点 */
const root = new TreeNode(1, null, null);
```

而在 Rust 中，问题就显现出来了，同样的逻辑：

```Rust
struct TreeNode<T> {
    value: T,
    left: TreeNode<T>,
    right: TreeNode<T>,
}

fn main() {}
```

此时编译代码，会报错：

> recursive type `TreeNode` has infinite size.
>
> 译：`TreeNode` 是递归类型，其占据了无限的大小。

这是由于 Rust 中要求变量必须有且只有一个所有权拥有者。

而具有 `TreeNode` 类型的变量已经拥有了 `left`, `right` 的所有权，而 `left` 和 `right` 自身又是 `TreeNode` 结构，这种无限循环自然会报错。

因此，我们可以使用 Rust 中的 `Rc` 来将 `left` 和 `right` 改变成引用类型。

### Rc

`Rc` 全称 `Reference Counted`, 即基于引用计数的智能指针，它可以来支持多重所有权。

`Rc<T>` 类型的实例会维护一个用于记录值引用次数的计数器，当该计数器为零时，则意味着该值可以被安全地清理掉。

因此，我们可以将代码写为：

```Rust
use std::rc::Rc;

struct TreeNode<T> {
    value: T,
    left: Rc<TreeNode<T>>,
    right: Rc<TreeNode<T>>,
}
```

此时，再次编译代码，可以编译通过。

下面，我们来考虑如何生成一个节点：

```rust
fn main() {
    let root = TreeNode {
        value: 0,
        left: ????,
        right: ????,
    }
}
```

新的问题出现了，当创建新的节点的时候我们该给 `left` 与 `right` 生成空值？

### Option

Rust 中提供了非常优雅的枚举类型 `Option`, 其值为：

```rust
enum Option<T> {
    /// 表示不存在值
    None,
    /// 表示存在值 T
    Some(T),
}
```

因此，我们最终可以将类型定义为：

```rust
use std::rc::Rc;

struct TreeNode<T> {
    value: T,
    left: Option<Rc<TreeNode<T>>>,
    right: Option<Rc<TreeNode<T>>>,
}
```

此时，我们可以写一棵树：

```rust
fn main() {
    /// 可变的根节点
    let mut root = TreeNode {
        value: 0,
        left: None,
        right: None,
    };
    /// 左孩子
    let left_node = TreeNode {
        value: 1,
        left: None,
        right: None,
    };
    /// 右孩子
    let right_node = TreeNode {
        value: 2,
        left: None,
        right: None,
    };
    // 将根节点的左右孩子赋值
    root.left = Some(Rc::new(left_node));
    root.right = Some(Rc::new(right_node));
}
```

### RefCell

在上述树的前提下，考虑下一个问题，如果我们需要通过 `root` 来修改 `root.left.value` 的值，需要怎么做。

理所当然地想：

```rust
root.left.unwrap().value = 3;
// unwrap 可以将 Some(val) 返回 val.  
```

然而很遗憾，这样做会报错：

> cannot assign to data in an `Rc`

这是因为，`Rc` 属于不可变引用。

为此，可以使用 `RefCell<T>` 来实现内部可变性，它的内部实现使用了 `unsafe` 代码。

通常而言，改变不可变引用下的数据是被禁止的，但是不得已的情况下，需要使用 `unsafe` 代码来绕过 Rust 正常的借用规则。

最终，代码为：

```rust
use std::{cell::RefCell, rc::Rc};

struct TreeNode<T> {
    value: T,
    left: Option<Rc<RefCell<TreeNode<T>>>>,
    right: Option<Rc<RefCell<TreeNode<T>>>>,
}

fn main() {
    let mut root = TreeNode {
        value: 0,
        left: None,
        right: None,
    };
    let left_node = TreeNode {
        value: 1,
        left: None,
        right: None,
    };
    let right_node = TreeNode {
        value: 2,
        left: None,
        right: None,
    };
    root.left = Some(Rc::new(RefCell::new(left_node)));
    root.right = Some(Rc::new(RefCell::new(right_node)));

    if let Some(ref mut x) = root.left {
        x.borrow_mut().value = 4;
        println!("{}", x.borrow().value); 
        // result: 4
    }
}
```
