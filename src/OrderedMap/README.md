# `OrderedMap`

> 本文将介绍 ProseMirror 所依赖的 `orderedmap`.

简而言之，`OrderedMap` 是适用于存储**数据量较少的**的 map 类型，

它具有以下特性：

- 存储形式为 `[key1, value1, key2, value2, ....,]`.
- 寻找某个 `key` 对应的 `value` 操作的运行时间为 `O(n)`. 注，`HashMap` 为 `O(1)`, `Object` 为 `O(logn)`.
- 添加、删除任何元素均会生成一个新的 `OrderedMap`, 而之前的实例不发生变化。

基于上述特性，导致它只适用于**数据量较少**的情况。

另外，这里给出该 `OrderedMap` 的 UML 图：

![OrderedMap](https://img-blog.csdnimg.cn/45a4420928794d23b121b2e133f577be.png)

可见，其内部所有涉及到更新操作，均会生成一个新的 `OrderedMap`.

代码可见：

- [实现](./index.ts)
- [单测](./orderedMap.test.js)
