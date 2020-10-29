# JavaScript 中覆盖继承的对象

在 [JavaScript 中的继承](../JavaScript中的继承/README.md) 一文中，我们介绍了原型链实现继承的原理。

本文作为上文的补充，主要回顾面向对象的基本原理，以及可能踩到的坑。

假设我们拥有基类：

```typescript
interface o {
  b1?:()=>void;
  b2?:()=>void
}

class Base {
  public BaseAll:o = {
    b1: () => {
      console.log('b1')
    },
    b2: () => {
      console.log('b2')
    }
  }
}
```

该基类中含有一个对象 `BaseAll`, 该对象中包含两个方法：`b1`, `b2`.

之后，我们创建一个子类：

```typescript
class Sub extends Base {
  public BaseAll:o = {
    b1: () => {
      console.log('b3')
    }
  }
}
```

为了给 `Base.b1`实现不一样的功能，需要将 `Sub` 中的 `BaseAll` 覆盖 `Base` 中的 `BaseAll`, 但是这样做有一个副作用：覆盖导致了其他函数，例如 `b2` 变成了 `undefined`, 进而执行 `b2()` 时报错。

示例：

```javascript
const b = new Base();
const s = new Sub();
b.BaseAll.b1();  // b1
s.BaseAll.b1();  // b3
s.BaseAll.b2();  // error: s.BaseAll.b2 not a function.
```

## 使用展开语法来实现复制其他内容

现在，我们的问题是如何避免上述问题，即：修改 b1 内容同时，也保留 b2 函数。

可以这样思考：在子类中重新写一份与基类中完全相同的对象，之后修改所需的内容即可。

而重写一份比较繁琐，可以使用**展开语法**实现。

即，代码可以修改为：

```typescript
class Sub extends Base {
  constructor() {
    super();  // 继承 this
  }
  public BaseAll:o = {
    ...this.BaseAll,
    b1: () => {
      console.log('b3')
    }
  }
}
```

最后，效果为：

```typescript
const b = new Base();
const s = new Sub();
b.BaseAll.b1(); // b1
s.BaseAll.b1(); // b3
s.BaseAll.b2(); // b2
```
