# 从数学函数到 Haskell 函数

## 数学函数

高中课本中便对数学函数又一个清晰的定义：

**函数**表示两个不为空集的集合的对应关系，其输入所在集合被称为**定义域**，输出所在集合被称为**值域**，其形式可以表达为：

$f: A \rightarrow B $
$f(x) = y$

上式中，$A$ 为定义域，$B$ 为值域。

例如整数范围内的求和函数，其形式化的表达为：

$add: Z * Z \rightarrow Z$
$add(a,b) = a + b$

## Haskell 函数

由于 Haskell 是一个标准化的函数式编程语言，因此 Haskell 中的函数是纯函数，也是数学意义上的函数。

作为反例，诸如下面 js 代码：

```js
let base = 0;
function add(a,b) {
 let result = a + b + base;
 base += 1;
 return result;
}
// add 不是纯函数，包含外部作用域变量 base
add(1,2) // 3, 存在副作用：base 值发生变化
add(1,2) // 4, 输入相同但返回值不同
```

而在 Haskell 中，不会出现外部变量的值改变的情况（因为所有的值是一个 immutable 数据）。

## Haskell 类型

由于 Haskell 是强类型语言，因此，函数中的每个参数都需要指定类型，以下为 Haskell 中数据类型：

| Haskell 类型 |含义   |
|-            |-         |
|Int          |64位二进制  |
|Integer      |数学意义上的整数集 Z   |
|Float        |单精度浮点数|
|Double       |双精度浮点数|
|Char         |字符 |
|Bool         |布尔|
|list         |[Char]: 字符串；[Int]: 整数列表|
|tuple        |元组|

例如书写以下 Haskell 函数：

```haskell
increase x = x + 1
-- 声明函数 increase, 它接受一个参数 x, 返回值为 x + 1.
```

当声明函数时，Haskell 已经进行了自动类型推导：

```haskell
:type increase
-- increase :: Num a => a -> a
```

`:type` 是 Haskell 中内置的命令，它返回的是函数类型。

`a -> a` 是指，类型 a 到类型 a 的函数集合，可以理解该函数的输入为一个类型 a 的参数，输出的类型为 a.

## 递归函数

以阶乘为例，数学中的阶乘 fact 可以定义为：

1. 当输入为 0 时，结果为 1, 这是终止条件；
2. 当输入 n 大于 0 时，返回 fact(n - 1) * n.

思想移植到 Haskell 上，则为：

```haskell
fact n  
  | n >  0  = n * fact(n-1)
  | n == 0  = 1
```
