# 兑换零钱

在介绍*兑换零钱*问题之前，首先来来看一下*求解斐波那契数*的两种方式：递归与迭代。

## 递归的求解斐波那契数

斐波那契数是指满足 f(0) = 0, f(1) = 1, f(n) = f(n-1) + f(n-2) 的数字，依据公式，可以写下如下算法：

```js
function fib(n) {
  if (n == 0) {
    return 0;
  } else if (n == 1) {
    return 1;
  } else {
    fib(n - 1) + fib(n - 2);
  }
}
```

上面就是求解斐波那契数的递归版本，虽简洁直观，但存在严重的性能问题，例如，求解 `fib(4)` 时：

```
        f(4)
     /        \
   f(2)       f(3)
  /   \      /    \
f(0)  f(1) f(1)   f(2)
 |    |     |     /   \
 0    1     1   f(0) f(1)
                 |    |
                 0    1
```

从上面的树中可以看出，`f(2)` 被重复计算两次，这导致了递归版本的时间复杂度为 `O(2^n)`, 这意味着该算法在实际生产中是不可用的。

## 迭代的求解斐波那契数

解决上述问题有两个方案：1. 将计算过的数据保存在一个数组中，然后按需取值；2. 从前向后进行迭代，跳过重复计算的部分，其代码示例如下：

```js
function fib(n) {
  let pre = 0;
  let now = 1;
  for(let i = 0; i < n; i += 1) {
    now = now + pre;
    pre = now - pre;
  }
  return pre;
}
```

这种情况下，时间复杂度为 `O(n)`.

> 尾递归实现的斐波那契数解法的时间复杂度为 `O(n)`, 它的核心思想也是避免重复计算，其代码如下：
>
> ```js
> function fib(n) {
>   function inner(n, pre, now) {
>     if (n == 0) {
>       return 0;
>     } else if (n == 1) {
>       return 1;
>     } else {
>       return inner(n - 1, now, pre + now);
>     }
>   }
>   return inner(n, 0, 1);
> }
> ```
>

## 兑换零钱

兑换零钱问题可以看成复杂些的斐波那契数求解问题，其问题是：现在有不限量的 1 元、2 元、5元现金，那么有多少种方式将 6 元兑换成零钱？

首先以递归的方式来思考，那么问题可以转换为：兑换 6 元的方式种类等于兑换 1 元的方式种类加上用 1 元、2元兑换 6 元的方式种类，即递归树为：

```
      6(1,2,5)
     /        \
 1(1,2,5)    6(1,2)
            /     \ 
        4(1,2)    6(1)
        /    \
     2(1,2)  4(1)
      /   \
  0(1,2)  2(1)
```

> 上述方法的核心点在于：如何确定递归的分隔方式。

更数学一些的形式为：给定一个整数数组 `coins`, `coins` 内的元素可以随意组合，有多少种组合的和等于整数 `amount`?

其答案为：`sum(amount, coins) = sum(amount - coins[i], coins) + sum(amount, remove(coins, i))`.

很明显，该算法的时间复杂度为 `O(2^n)`.

下面，以迭代的方式进行思考，其问题的关键是：如何限制 `coins` 的数目，这里，可以选择优先遍历硬币数的方式来实现：

```js
function change(amount, coins) {
  const records = [1];
  for (let i = 1; i <= amount; i += 1) {
    records[i] = 0;
  }
  for (const coin of coins) {
    for (let i = 1; i <= amount; i+= 1) {
      if (i >= coin) {
        records[i] += records[i - coin];
      }
    }
  }

  records[0] = undefined; // just for tag.
  console.log(records)
  return records[amount];
}
```

当然，也可以使用二位数组。