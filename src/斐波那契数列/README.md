# 斐波那契数列

斐波那契数列的每一项的值为前两项的和。以 1, 2 开头，前十项为：1,2,3,4,5,8,13,21,34,55,89....

## find nth-Fibonacci

首先考虑如何求斐波那契数列。

### 方法一：按照定义递归

斐波那契数列按照定义为 f(n) = f(n-1) + f(n-2). 看起来很简单，实现也很简单。

```js
/**
 * @param {number} n
 * @returns {number}
 */
function FibonacciN(n) {
  if (n === 1) {
    return 1;
  } else if (n === 2) {
    return 2;
  }
  return FibonacciN(n - 1) + FibonacciN(n - 2);
}
```

以上方式最容易理解，但是也有很大的性能问题：重复计算；

以 n = 4 为例，我们来看它的递归树：

```
           f(4)
        /        \
      f(2)        f(3)
     /    \      /   \
  f(0)  f(1)   f(1)  f(2)
                     /   \
                   f(0)  f(1)
```

可见，递归计算 f(4) 的过程中，多次重复计算了 f(2).. 当 n 变大时，这种重复计算不断变多，导致性能非常差，约为指数量级。

### 方法二：用数组存储

不用递归，开辟一个数组：

```js
/**
 * @param {number} n
 * @returns {number}
 */
function FibonacciN(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      arr.push(1);
    } else if (i === 1) {
      arr.push(2);
    } else {
      arr.push(arr[i - 1] + arr[i - 2]);
    }
  }
  return arr[n - 1];
}
```

这样，可以在线性的时间求解斐波那契数列第 n 项。

但问题也随之而来，也带来的线性空间复杂度。

### 方法三：抛弃数组，只用两个变量

设置两个变量，f = 1, g = 2.

考虑以下迭代过程：g = f + g, f = g - f.

该过程就是 Fibonacci 数列求解的迭代过程。

```js
/**
 * @param {number} n
 * @returns {number}
 */
function FibonacciN(n) {
  if (n === 1 || n === 2) {
    return n;
  }
  // f 代表前一个数字，g 表示当前数字
  let f = 1,
    g = 2;
  while (n-- > 1) {
    g = f + g;
    f = g - f;
  }
  console.log(f);
}
```

该方法依旧是线性时间，但空间复杂度为原地。

### 方法四：最快有多快

借助矩阵，可以将求解的运行时间优化到对数量级。

我们依旧利用：F(n) = F(n-1) + F(n-2), F(0) = 0, F(1) = 1;（与原题目给出的条件有所出入，但无大碍）

首先确定以下等式：

![](https://img-blog.csdnimg.cn/20200413104502133.png)

令：

![](https://img-blog.csdnimg.cn/20200413104632542.png)

带入并推导，可得：

![](https://img-blog.csdnimg.cn/20200413104844646.png)

利用二分的思想，得到：

![](https://img-blog.csdnimg.cn/20200413105054428.png)

据此，可以得到对数量级的运算公式。

代码：

```js
/**
 *
 * @param {number[2][2]} a
 * @param {number[2][2]} b
 * @returns {number[2][2]}
 */
function matrixMultiply(a, b) {
  var res = [
    [0, 0],
    [0, 0],
  ];
  res[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0];
  res[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1];
  res[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0];
  res[1][1] = a[1][0] * b[1][0] + a[1][1] * b[1][1];
  return res;
}

/**
 * @param {number} n
 * @returns {number}
 */
function FibonacciN(n) {
  var p = [
    [1, 1],
    [1, 0],
  ];
  if (n === 1) {
    return p;
  }
  if (n % 2 === 1) {
    return matrixMultiply(
      matrixMultiply(
        FibonacciN(Math.floor(n / 2)),
        FibonacciN(Math.floor(n / 2))
      ),
      p
    );
  } else if (n % 2 === 0) {
    return matrixMultiply(FibonacciN(n / 2), FibonacciN(n / 2));
  }
}
```

该方法运行时间为对数量级，相比于线性时间可谓是质的提升。另外，该方法的空间复杂度也为对数量级。
