# CSS 中的 `@import`

当开始学习 HTML 与 CSS 时，会遇到一个基本的问题：如何引入一个 css 文件？

答案也很简单：

1. 在 HTML 中，可以通过 `<link rel="stylesheet" href="you-css-file-name.css">` 的方式来引入；
2. 在 CSS 中，通过 `@import` 语法来引入其他的 CSS 文件。

本文将讲述 `@import` 语法，并扩展到 Less 和 Sass 中对 `@import` 的扩展。

## CSS 中的 `@import`

`@import` 提供了两种语法：

1. `@import "aaa.css"`
2. `@import url("bbbb.css")`

需要注意的是，按照 W3C 中对 [`@import` 语法的规定](https://drafts.csswg.org/css-cascade-4/#at-import)，这两种写法**没有**任何区别。

另外还规定，`@import` 语法必须在除 `@cahrset` 之外的所有标签前，否则该 `@import` 会失效，示例如下：

```css
div {
  color: red
}
/* 
 * 在 div 标签之下使用 @import 会失效
 */
@import "./lib.css"
```

另外，还可以直接引入一个 cdn 地址，例如：

```css
@import "https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/1.1.0/modern-normalize.css"
```

此外，还有一些冷门的用法：

```css
/* 媒体查询 */
@import url("style.css") handheld and (max-width: 400px);
/* supports */
@import url("fallback-layout.css") supports(not (display: flex));
```

## Less 中的 import 扩展

1. Less 中 `@import` 语句即使放到其他标签后依然生效；
2. Less 中 `@import` 语句解析时，有一些后缀约束，例如：

    ```less
    // 无后缀时，自动加上 less 后缀，即引入 foo.less
    @import "foo";      
    // 引入 foo.less
    @import "foo.less";
    // 若后缀为 css, 则将其视为 css 文件
    @import "foo.css";
    // 后缀为其他， 则将其视为 less 文件
    @import "foo.php"; 
    ```

3. Less 中增加导入选项：`@import (keyword) "filename"`:
    - reference: 表示当 Less 转 CSS 时除 `extend` 和 `mixins` 外均不生成；
    - inline: 引入文件但不处理，例如引入 Less 不兼容的文件；
    - less: 无视文件后缀，均以 less 文件进行处理；
    - css: 无视文件后缀，均以 css 文件进行处理；
    - once: 无论该文件被引入多少次，生成 CSS 时只会引入一份；
    - multiple: 该文件被引入多少次，生成 CSS 时会引入多少份；
    - optional: 若引入文件不存在不会报错，存在则引入。

## Sass 中的 import 扩展

1. CSS 中 `@import` 可能会发生 HTTP 请求，而 Sass 的 `@import` 在编译阶段被完全处理；
2. Sass 内可以一次引入多个文件：`@import 'a.sass', 'b.sass'`.
3. Partials 功能，对于文件 `_style.scss`, 可以执行 `@import 'style.scss'` 来引入；
4. 移除了 CSS 内 `@import` 只能在顶部的限制。
