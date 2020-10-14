# 素数

## prime

- 质数/素数：只可以被自身和 1 整除的数字。注意，1 不是素数。
- 合数：不是质数的其他大于 1 的数字。

注意，1 不是素数也不是质数。

我们首先需要搞清楚：如何判断一个数是不是质数。

### 方法一：按照定义

对于整数 n, 设置一个从 2 ~ n-1 的循环，检查 n 能否被其中的数字整除，若能，则 n 不是素数。

```js
/**
 *
 * @param {number} n
 * @returns {Boolean}
 */
function isPrime(n) {
  if (n === 1) {
    return false;
  }
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
```

上述算法对于**一个**整数的判断，运行时间达到了线性时间，是非常不理想的。

### 方法二：初步优化

考虑以下推论：

若 n 为合数，则 n 能表示成 n=pq, 其中 p,q>1. 显然，p,q 中一定有一个数字不超过 sqrt(n).

（想象一下，如果 p,q 均超过 sqrt(n), 则 pq>n）

依据上述推论，可以将原先的循环依照 sqrt(n) 分成两部分，这两部分是一一对应的，因此可以把时间复杂度降低到根号量级。

```js
/**
 *
 * @param {number} n
 * @returns {Boolean}
 */
function isPrime(n) {
  if (n === 1) {
    return false;
  }
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
```

### 方法三：再来一些优化

由质数的特性：质数总等于 6x+1 或 6x-1, 其中 x 为不小于 1 的自然数。

该特性是如何得到的？

考虑，6x+k, k=0,1,2,3,4,5. 当 k=0,2,4 时候，一定可以被 2 整数；当 k=3 时，一定可以被 3 整除。那么只剩下 6x+1 和 6x+5 了。

据此，循环可以进一步优化：

```js
/**
 *
 * @param {number} n
 * @returns {Boolean}
 */
function isPrime(n) {
  if (n <= 3) {
    return n > 1;
  }
  // 不在 6x 两侧的数字一定不是质数
  if (n % 6 !== 1 && n % 6 != 5) {
    return false;
  }
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
  }
  return true;
}
```

### 方法四：埃氏筛法

以上这些算法虽然有所优化，但总体而言并不快。

我们介绍另外一种求素数的方法：筛法。

筛法分为两种：埃拉托尼斯筛法（埃氏筛法）、欧氏筛法（线性筛法）。

埃式筛法的思想很简单，它返回的结果是某个区间内的所有素数。用二重循环实现，在内层循环中筛去哪些为第一层循环倍数的数字，最后没有被删除的数字即为质数。

```js
/**
 * @param {number} n
 * @returns {number[]}
 */
function eratosthenesSieve(n) {
  var res = [];
  var record = [];
  for (let i = 2; i <= n; i++) {
    if (record[i] === false) {
      continue;
    }
    for (let j = 2; i * j <= n; j++) {
      record[i * j] = false;
    }
    if (record[i] === undefined) {
      res.push(i);
    }
  }
  return res;
}
```

上述代码的时间复杂度为:O(nloglogn).

为了方便理解，我写了一段代码，用以图形化展示上述过程：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200420151652948.gif)

- 实现上述动画的代码见最下。

### 方法五：欧式筛法

考虑埃式筛法的第二层循环，即`record[i*j] = false`, 其实此处存在重复计算，例如对于整数 12, 会被质数 2 和 3 两次标记。重复标记的原因在于没有唯一确定整数 12 的产生方式。

欧拉线性筛法考虑了上述情况，首先明确一个条件，一个合数可以表示为一系列素数的乘积，因此每个合数必定有一个最小的素数因子，我们使用这个最小的素数因子来筛，保证了每个合数最多被筛去一次。

```js
/**
 * @param {number} n
 * @returns {number[]}
 */
function eulerSieve(n) {
  var res = [];
  var record = [];

  for (let i = 2; i <= n; i++) {
    if (record[i] === undefined) {
      //此时一定是素数
      res.push(i);
    }
    for (let j = 0; j < res.length && i * res[j] <= n; j++) {
      //当前所有的质数
      record[i * res[j]] = true; //筛选出合数
      if (i % res[j] === 0) {
        //保证不被重复判断
        break;
      }
    }
  }
  return res;
}
```
