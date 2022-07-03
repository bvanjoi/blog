# Data Flow Analysis: Live Variables

若程序中点 P 开始，沿着 CFG 内某条路径，变量 V 有被使用（同时这表示变量 V 没有被重定义），则变量 V 在点 P 是存活的，否则变量 V 在点 P 是死的。

> 注意，Live Variables 适合使用从后向前(backward)的算法。这是因为如果从前向后(forward)得计算，会需要关注之前的点的状态。

- Live Variables 的控制流： `OUT[B] = all_union(IN, predecessor_of_b)`.
- Live Variables 的转移函数： `IN[B] = union(used_in_B, exclude(OUT[B], redefined_in_B)`.

注意，这里的 `used_in_B` 是指块 B 的使用过的变量；`redefined_in_B` 是指块 B 内被重新定义的变量。

## Live Variables 的算法实现

- 输入：CFG
- 输出：每个 BB 的 IN[B] 和 OUT[B].

其算法实现为：

```
IN[exit] = empty
for BB in exclude(all_bbs, exit) {
  IN[BB] = empty
}
while has_any_changed(IN) {
  for BB in exclude(all_bbs, exit) {
    OUT[B] = all_union(IN, predecessor_of_b)
    IN[B] = union(used_in_B, exclude(IN[B], redefined_in_B)
  }
}
```

> 一般而言，may analysis 的初始值为 empty; must analysis 的初始值为 all.

## 示例

来看下面控制流图的 Live Variables:

```
           Entry
             |
            \/
        |---------------|
B1      |  x = p + 1    |
        |  y = q + z    |
        |---------------|
        |    |          |
        |   \/          |
    --> |---------------|
B2  |   |  m = k        |
    |   |  y = m - 1    |
    |   |---------------| ------
    |   |    |          |      |
    |   |   \/          |     \/
    |   |---------------|   |----------------|
B4  |   |  x = 4        |   |  x = x - 3     | B3
    |   |  q = y        |   |                |
    --- |---------------|   |----------------|
        |    |          |      |
        |   \/          |      |
        |---------------|  <----
B5      |  z = 2p       |
        |---------------|
             |
            \/
           Exit
```

下表中 IN/OUT 的每一位分别代表 `[x, y, z, p, q, m, k]`, 注意，这里的 IN 是反向的 IN, 即正向的 OUT.

初始化：

| BB  | IN       | OUT      |
| --- | -------- | -------- |
| 1   | 000 0000 | xxx xxxx |
| 2   | 000 0000 | xxx xxxx |
| 3   | 000 0000 | xxx xxxx |
| 4   | 000 0000 | xxx xxxx |
| 5   | 000 0000 | xxx xxxx |

第一轮：

| BB  | IN       | OUT      | 备注                                  |
| --- | -------- | -------- | ------------------------------------- |
| 1   | 100 1001 | 001 1101 |                                       |
| 2   | 110 1000 | 100 1001 |                                       |
| 3   | 000 1000 | 100 1000 |                                       |
| 4   | 000 1000 | 010 1000 | IN[B[4]] = union(OUT[B[2], OUT[B[5]]) |
| 5   | 000 0000 | 000 1000 |

相较于初始化后的 IN, 第一轮后的 IN 都发生了变化，因此需要第二轮：

| BB  | IN       | OUT      |
| --- | -------- | -------- |
| 1   | 100 1001 | 001 1101 |
| 2   | 110 1001 | 100 1001 |
| 3   | 000 1000 | 100 1000 |
| 4   | 100 1001 | 010 1001 |
| 5   | 000 0000 | 000 1000 |

相较于第一轮后的 IN, 第二轮后的 IN[B[4]], IN[B[2]] 发生了变化，因此需要第三轮：

| BB  | IN       | OUT      |
| --- | -------- | -------- |
| 1   | 100 1001 | 001 1101 |
| 2   | 110 1001 | 100 1001 |
| 3   | 000 1000 | 100 1000 |
| 4   | 100 1001 | 010 1001 |
| 5   | 000 0000 | 000 1000 |

第三轮结束后，IN 没有发生变化，迭代结束。

下面来看 OUT 的含义，以 OUT[B[3]] 为例，`1001 000` 表示变量 x 到块 B[3] 之前是存活的。
