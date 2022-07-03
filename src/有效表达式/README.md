# Data Flow Analysis: Available Expression

当从程序入口到点 P 中，所有的路径使用到了 `x op y`, 且各自路径上最后使用 `x op y` 后没有重新定义 `x op y`, 则称表达式 `x op y` 是有效的。

> 很明显，由于是**所有**路径，所以 Available Expression 是 must analysis.

- Available Expression 的控制流： `IN[B] = all_intersection(OUT, predecessor_of_b)`.
- Available Expression 的转移函数： `OUT[B] = union(generated_of_B, exclude(IN[B], killed_in_B))`.

注意，这里的 `generated_of_B` 是指块 B 使用到 `x op y`；`kill_in_B` 是指在块 B 内重新定义了某个变量。

## Available Expression 的算法实现

- 输入：CFG
- 输出：每个 BB 的 IN[B] 和 OUT[B].

其算法实现为：

```
OUT[entry] = empty
for BB in exclude(all_bbs, entry) {
  OUT[BB] = all
}
while has_any_changed(OUT) {
  for BB in exclude(all_bbs, entry) {
    IN[B] = all_intersection(OUT, predecessor_of_b)
    OUT[B] = union(generated_of_B, exclude(IN[B], killed_in_B))
  }
}
```

## 示例

来看下面控制流图的 Available Expression:

```
           Entry
             |
            \/
        |---------------|
B1      |  y = p - 1    |
        |---------------|
        |    |          |
        |   \/          |
    --> |---------------|
B2  |   |  k = z / 5    |
    |   |  p = e^(7x)   |
    |   |---------------| ------
    |   |    |          |      |
    |   |   \/          |     \/
    |   |---------------|   |----------------|
B4  |   |  x = 2 * y    |   |  z = y + 3     | B3
    |   |  q = e^(7x)   |   |                |
    --- |---------------|   |----------------|
        |    |          |      |
        |   \/          |      |
        |---------------|  <----
B5      |  m = e^(7x)   |
        |  y = z / 5    |
        |---------------|
             |
            \/
           Exit
```

下表中 IN/OUT 的每一位分别代表 `[p - 1, z / 5, 2 * y, e^(7x), y + 3]`.

初始化：

| BB    | IN     | OUT    |
| ----- | ------ | ------ |
| Entry | x xxxx | 0 0000 |
| 1     | x xxxx | 1 1111 |
| 2     | x xxxx | 1 1111 |
| 3     | x xxxx | 1 1111 |
| 4     | x xxxx | 1 1111 |
| 5     | x xxxx | 1 1111 |

第一轮：

| BB  | IN     | OUT    | 备注                                   |
| --- | ------ | ------ | -------------------------------------- |
| 1   | 0 0000 | 1 0000 |                                        |
| 2   | 1 0000 | 0 1010 | IN[B[2]] = union(OUT[B[4]], OUT[B[1]]) |
| 3   | 0 1010 | 0 0011 |                                        |
| 4   | 0 1010 | 0 1110 |                                        |
| 5   | 0 0010 | 0 1010 |                                        |

相较于初始化后的 OUT, 第一轮后的 OUT 都发生了变化，因此需要第二轮：

| BB  | IN     | OUT    |
| --- | ------ | ------ |
| 1   | 0 0000 | 1 0000 |
| 2   | 0 0000 | 0 1010 |
| 3   | 0 1010 | 0 0011 |
| 4   | 0 1010 | 0 1110 |
| 5   | 0 0010 | 0 1010 |

相较于第一轮后的 OUT, 第二轮后的 OUT 没有发生变化，迭代结束。

下面来看 OUT 的含义，以 OUT[B[3]] 为例，从 `0 0011` 可知，表达式 `e^(7x)` 在块 B[3] 结束时，是有效的。
