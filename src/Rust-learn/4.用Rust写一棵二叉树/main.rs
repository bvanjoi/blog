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
        println!("{}", x.borrow().value); // 4
    }
}