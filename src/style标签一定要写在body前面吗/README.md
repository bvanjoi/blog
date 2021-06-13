# style 标签一定要写在 body 前面吗

如果你参加前端面试，那么一定会遇到一个问题：

如何优化页面性能？

如果你看过一些面经，则针对这个问题的回答会有：在 html 中把 style 标签放到 body 前（head 内），script 标签放到 body 尾。原因是 html 是顺序加载的，style 放到头部可以防止后续多次渲染，script 放到尾部是防止阻塞。

那么，回到这个问题，style 标签一定要写在 body 前面吗？

回答：是的，html 标准中规定, style 标签属于 Metadata content[1], 而依据 html 定义[2], metadata tags 需要放到 head 标签内。

1. <https://html.spec.whatwg.org/#the-style-element>
2. <https://stackoverflow.com/questions/1447842/what-happens-if-the-meta-tags-are-present-in-the-document-body>

## 规矩如此，便对么？

打开 google.com, 再打开开发者工具，可以看到：

![违背上述答案的 goggle 首页](https://img-blog.csdnimg.cn/20210613204129253.png)

清晰地看到，style 标签既然放到了 body 内。

之后再查阅一些资料，看到了相关 [issue](https://github.com/whatwg/html/issues/1605), 说是因为 link 标签支持在 body 内，为什么 style 就不支持；几乎所有浏览器都内解析 body 内的 style, 那么还有必要坚持上述准则吗？

在讨论中也有一些值得参考的想法。
