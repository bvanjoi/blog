# URL 编码

HTTP 传输中，URL 上可能带有各种 query 信息，例如使用百度搜索天气时，其域名为：

```txt
https://www.baidu.com/s?ie=UTF-8&wd=%E5%A4%A9%E6%B0%94
```

上述字符中 `%E5%A4%A9%E6%B0%94` 即为 `天气` 的 URL 编码：

![天气 的URL编码](https://img-blog.csdnimg.cn/20210528005139250.png)

其实，上述字符中，还有诸如 `?` 等字符也可以被编码：

```js
encodeURIComponent('https://www.baidu.com/s?ie=UTF-8&wd=%E5%A4%A9%E6%B0%94')
// 'https%3A%2F%2Fwww.baidu.com%2Fs%3Fie%3DUTF-8%26wd%3D%25E5%25A4%25A9%25E6%25B0%2594'
```

## 为什么需要 URL 编码

URL 中，query 采取了 `router?key1=value1&key2=value2` 的格式，其中 `?`, `=`, `&` 作为保留字具有特殊的含义，如果 `valuexx` 中存在相同的保留字字符，会导致服务器解析错误，因此，需要对其进行编码处理。

## `encodeURI` 和 `encodeURIComponent`

在 RFC3986 中，给出两种类别的字符集：**保留字**和**非保留字**：

- 保留字：是指具有一定实际作用的字符，有 `:`, `/`, `?`, `#`, `(`, `)`, `@`,  `&`, `+`, `;`, `=`.

> 保留字需要依据上下文来决定是否转义；
>
> 在 JavaScript 中，`encodeURI` 不会转义保留字，而 `encodeURIComponent` 会转义。
>
> 参考：<https://datatracker.ietf.org/doc/html/rfc3968#section-2.2>

![JS 中保留字示例](https://img-blog.csdnimg.cn/20210528005822624.png)

- 非保留字：任何情况下都不会被转义的字符，有 `a-zA-Z`, `0-9`, `-`, `.`, `_`, `~`.

> 参考：<https://datatracker.ietf.org/doc/html/rfc3968#section-2.3>

![JS 中非保留字示例](https://img-blog.csdnimg.cn/20210528010338898.png)

综上，两个函数的安全字符（即不会被转义的字符）为：

- `encodeURI`: `!#$&'()*+,/:;=?@-.~0-9a-zA-Z`
- `encodeURIComponent`: `a-zA-Z0-9-._~!'()*`

## `escape`

JS 中 `escape` 可以讲字符串转义为指定的十六进制序列，但是该方法已经被废弃，没有使用的必要。

这里还是给出 `escape` 的安全字符：`*/@+-._0-9a-zA-Z`.

## 奇怪的 URL 编码

实际代码中，可能会遇到一个奇怪的问题：`encode` 和 `decode` 两个函数不对称，例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="gb2312">
  <title>wrong encode/decode</title>
</head>
<body>
  <script>
    const char = encodeURIComponent("中文")
    document.write(char)
    document.write('<p></p>')
    document.write(decodeURIComponent(char))
  </script>
</body>
</html>
```

其结果为：

![异常的 encode/decode](https://img-blog.csdnimg.cn/20210528012325632.png)

这是因为，URL 编码遵守下述规范：对于非 ASCII 字符，其编码集取决于当前文档中使用的字符集。

而上述 HTML 代码中，`<meta charset="gb2312">` 将字符集约定为 `gbd2312`, 因此 `encodeURIComponent` 使用的是  `gbd2312`, 但 `decodeURIComponent` 使用的字符集为 `utf-8` 因此造成问题。

纠正方式也很简单：

```html
- <meta charset="gb2312">
+ <meta charset="UTF-8">
- <title>wrong encode/decode</title>
+ <title>right encode/decode</title>
```

结果为：

![正确的 URL 编码](https://img-blog.csdnimg.cn/20210528012446441.png)
