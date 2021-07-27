# 所谓编程范式

> 每个编程语言，都是在特定的环境下为解决特定的问题而产生的。

## 泛型编程

> 泛型编程的思想是将不同的数据类型结合在一起。

首先来看这么一个 C 函数：

```cpp
void swap(int* x, int* y) {
 int tmp = *x;
 *x = *y;
 *y = temp;
}
```

`swap` 函数通过指针来实现了两个 `int` 型变量的交换，但是该函数有一个问题：如果实现任何数据类型的变量的交换？

对此，需要有一种**泛型**的概念：对于传入的所有类型，我的函数均可以正确处理。

那么，在 C 语言中，可以这么写：

```cpp
/**
 * 交换两个参数
 * @param x 需要交换的参数
 * @param y 需要交换的参数
 * @param size 指定 x 和 y 类型在内存中的大小
 * */ 
void swap(void* x, void* y, size_t size) {
 // tmp 是用于数据交换的临时空间存储
 char tmp[size];
 // 存储 y
 memcpy(tmp, y, size);
 // 交换 x, y
 memcpy(y, x, size);
 memcpy(x, tmp, size);
}
```

在 Cpp 中，使用模板来定义函数和类型，进而实现了范型编程：

```cpp
template<class T>
void swap(T* a, T* b) {
 T temp = *a;
 *a = *b;
 *b = temp;
}
```

如果有一些 python 基础，可以通过执行下列代码实现 `swap`:

```python
a, b = b, a
```

## 函数式编程

> 函数式编程只关心输入数据和输出数据的关系。

函数式编程具有以下特性（下面示例代码均为 JavaScript）

- 函数是一等公民：函数与其他数据类型一样，可以当作变量赋值，也可以当作参数，也可以当作返回值。

  ```javascript
  // 函数当作变量赋值
  let sum = (a,b) => a + b;
  function a(f) {
    // 函数被当作参数传入
    f()
    // 函数被当作参数返回
    return f;
  }
  ```

- 无副作用：不修改变量。

  ```javascript
  // 无副作用函数
  let sum = (a,b) => a + b;
  // 有副作用函数
  let addOne = (a) => {
    a += 1;
    return a;
  }
  ```

因为上述原因，也导致函数式编程*可能*会对性能有一些影响，例如 `sum` 中，返回结果为 `a + b`, 为重新生成了一个变量；但是在 `addOne` 中，只是对原有变量操作。

## 面向对象编程

> 面向对象具有三大特性：封装、继承、多态。

以 Java 代码作为示例，来看什么是面向对象：

```java
/**
 * 封装的 Animal 类型
 */
public class Animal {
    String type = "animal";
    String name;

    public Animal() {
        this.name = "undefined name";
    }

    /**
     * 构造函数的多态
     */
    public Animal(String name) {
        this.name = name;
    }

    public void bark() {
        System.out.println(this.name + "is barking");
    }
}

class Dog extends Animal {
    String type = "Dog";

    /**
     * 重载
     */
    @Override
    public void bark() {
        // 覆盖
        System.out.println("dog bark");
    }
}
```
