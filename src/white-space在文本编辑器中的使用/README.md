# white-space 在文本编辑器中的使用

在使用 `div[contenteditable = true]` 构建富文本编辑器的过程中，遇见一个有意思的问题。

先看动图：

![空格问题](https://img-blog.csdnimg.cn/20210306125334249.gif)

描述即为：段落中的某个字符处于前后为空格的状态，且空格前后也有字符时，例如 `a b c`, 当**选区**选中字符 `b` 时，按下 Backspace 键，会造成字符串 `b` 的删除。

## 第一反应

我的第一反应是选区出现的问题，即虽然只选中字符 `b`, 但是，实际上也将其后面的空格选中。

但是，随后的验证排除了这个选项：

- 验证方法一：打印出 selection 的 anchor 和 head. 由于我是用的库为 prosemirror, 所以需要执行 `console.log(view.state.selection.anchor,view.state.selection.to)`, 此处的演示比较抽象，因此略过。直接说结论：选中 `b` 后执行删除，并未删除之后的空格。因此排除 prosemirror 的选区的问题。
- 验证方法二：看 dom 树，当选中`b`, 并执行删除后，虽然在样式上呈现 `a c`, 但实际的存储中为 `a  c`.

![选区删除字符 b 后](https://img-blog.csdnimg.cn/20210306130159687.png)

## 结论与解决方案

因此，是渲染出现了问题。

随后查阅了一些资料，给 `div[contenteditable = true]` 添加上 CSS `white-space: pre-wrap;` 即可。

最终效果为：

![效果正确的删除](https://img-blog.csdnimg.cn/20210306130733104.gif)

## 扩展：white-space

`white-space` 属性用来处于元素内的空白符与换行。

其可选属性有：

- normal: 会对多个空白符转化为一个，即出现上述问题。
- nowrap: 不会被换行。
- pre-line: 合并空白符，保留换行符。
- pre-wrap: 保留空白符号，并正常换行。
- inherit: 继承父元素的 `white-space` 值。
