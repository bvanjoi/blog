# React 中的 key

思考一个场景：用 React 写一个页面，实现具有增删功能 TodoList 的列表。

从逻辑上讲，这道题非常简单。

首先，使用一个名为 `list` 的数组来记录所有的 TodoList, 然后实现两个函数：

- 一个函数名为 `addItem(value: string) => void`, 它负责将名为 `value` 的事件加到 `list` 中；
- 一个函数名为 `deleteItem(index: number) => void`, 它负责将下标为 `index` 的事件从 `list` 中删除。

之后，可以书写以下的代码来实现 React 中列表的渲染：

```js
const ListShow = (props) => {
  const {list, deleteItem} = props; 
  return (
    <ul>
      {list.map((value, index) => (
        <li>
          <span>{value}</span>
          <button
            onClick={() => {
              deleteItem(index);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

但是，对于上述代码，在 `<li>` 一行中，我们缺少了重要的一个值：`key`, 由此，导致了 React 的 Warning:  `Warning: Each child in a list should have a unique "key" prop.`

## key 是什么

在 React 中，对于列表的渲染，需要为*列表中*（而不是全局）的每一项赋予**不同**的 `key` 值, 以帮助 React 识别哪些元素被改变。

### 如果 `key` 重复了呢？

我们把代码写成如下：

```js
const ListShow = (props) => {
  const {list, deleteItem} = props; 
  return (
    <ul>
      {list.map((value, index) => (
        <li key={value}>
          <span>{value}</span>
          <button
            onClick={() => {
              deleteItem(index);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

注意，唯一的不同是将 `<li>` 更改为 `<li key={value}>`, 这也埋下了坑点：当我们添加相同 todo, 会产生相同的 key 值，这时会造成非常严重的渲染问题，例如，当 `list` 中的内容为 `['1','2','3','1','2','3']`, 再进行添加和删除时，结果如下：

![key is repeat](https://img-blog.csdnimg.cn/20210320210822840.gif)

不去深究 React 源码的执行机制，但要记住：**React 中任何列表的渲染，key 都应该保持唯一**。

### 不建议用 `index` 作为 `key`

既然要求 key 值不唯一，那么自然就想到用*索引*来充当 `key` 值。

首先，来看索引作为 `key` 的代码：

```js
const ListShow = (props) => {
  const {list, deleteItem} = props; 
  return (
    <ul>
      {list.map((value, index) => (
        <li key={index}>
          <span>{value}</span>
          <button
            onClick={() => {
              deleteItem(index);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

其效果如下：

![index as key](https://img-blog.csdnimg.cn/20210320211749967.gif)

可见，TodoList 可以符合预期的运行。

**但是**，React 官网并不建议用 `index` 作为 key 值，因为每次增加或删除操作，都会导致 `list` 中的 `item` 的索引的变化，例如 `['1','2','3']` 对应的索引为 `[0,1,2]`, 执行 `deleteItem(1)` 后结果就变为 `['1', '3']`, 索引为 `[0,1]`. 这会导致 diff 算法重新遍历一边来进行比较。

另外，将 `index` 作为 key 值也可能会导致渲染问题，可见：<https://jsbin.com/wohima/edit?output>.

### 该怎么做

其实，很多列表展示的是从数据库拿到的数据，而数据库表的主键 id 是唯一的，因此，建议使用类似于这种的 `id` 作为 `key` 值。

## 为什么会有这篇文章

看到这，有人就会有疑问，这不是 React 官网早已叙述过的内容吗，为什么还值得写出来呢？

原因来自于 antd3 中的一个坑点：通过 react devtools 可以看到，其 `key` 值为其 `value`.

![key in select of antd3](https://img-blog.csdnimg.cn/20210320220407463.png)

> antd 中 select 复用了 rc-select 组件，但在 rc-select 中是设计如此，还是一个 bug, 便不得而知。

## 我的观点

综上，我认为，在使用 react 列表中，应该：

1. 任何情况下都**不要**使用重复的 `key` 值。
2. 如果不需要考虑列表的增加/删除/变更等操作，则可以使用索引 `index`, 但并不建议。
3. 建议使用唯一不可变的标识 `id`.

> 关于重复 key 和以索引为 key 可见示例：<https://codepen.io/bvanjoi/pen/BaQXRJb>
