# URI 与 URL 与 URN

页面任何一个网络请求，实际上请求的是服务器的资源。

而每一个资源，都需要一个唯一的地址来标识。

该地址便是 URI, Uniform Resource Identifier, 统一资源**标识符**。

## URI

URI 是标识某一资源的字符串，其通用格式为：

```txt
URI = scheme:[//authority]path[?query][#fragment]
```

其中，

```txt
authority = [userinfo@]host[:port]
```

- `scheme`: 指应用层协议，例如 `http`, `https`, `ftp` 等。
- `userinfo`: 【可选】用户名以及密码。
- `host`: 域名或 IP 地址。
- `port`: 【可选】端口号。
- `path`: 路径。
- `query`: 【可选】用于携带一些数据，例如三方认证时的 token.
- `fragment`:【可选】 包含一些片段标识符，例如页面内的锚点。

例如：

```txt
|scheme| userinfo   |    host       |port|        path   |  query |                    | fragment
https://john.doenodw@www.example.com:1234/forum/questions/?tag=networking&order=newest#top
```

```txt
|scheme|   host      | path(root path, it's empty)
https://www.baidu.com/
```

通过上述形式，我们可以唯一地指定一个资源。

甚至，URI 可以指向非网络资源（参考自：RFC 3986, Section 1.1.2）

```txt
tel:+1-816-555-1212
```

### URI in JavaScript

在 JavaScript 中，提供了 `encodeURI` 和 `decodeURI` 的 API, 它们分别可以将 UTF-8 的字符串进行转义字符转化，例如：

```javascript
const utf8 = 'https:www.baidu.com?x=天气不错'
const uri = encodeURI(utf8);
console.log(uri);
// https:www.baidu.com?x=%E5%A4%A9%E6%B0%94%E4%B8%8D%E9%94%99
console.log(decodeURI(uri));
// https:www.baidu.com?x=天气不错
```

同时，JavaScript 还提供了 `encodeURIComponent` API, 相对于 `encodeURI`, `encodeURIComponent` 会对字符串中的功能字符（例如， `&`, `?`, `/`, `=` 等）进行转义。

例如：

```javascript
const utf8 = 'https:www.baidu.com?x=天气不错'
console.log(encodeURI(utf8););
// https:www.baidu.com?x=%E5%A4%A9%E6%B0%94%E4%B8%8D%E9%94%99
console.log(encodeURIComponent(utf8););
// https%3Awww.baidu.com%3Fx%3D%E5%A4%A9%E6%B0%94%E4%B8%8D%E9%94%99

// 注意 : ? = 这些字符，在 encodeURIComponent 中也被转译。
```

## URL

URL, Uniform Resource Locator, 即统一资源**定位符**。

URL 是 URL 的一种具体实现形式，它使用**地址**来定位一个资源，可以使用 URL 直接找到地址。可以说，URL 是 URI 的子集。

> The term "Uniform Resource Locator" (URL) refers to the subset of URIs. - RFC 3986, Section 1.1.3

在互联网中，URL 几乎等价于 URI.

## URN

URN, Uniform Resource Name, 统一**资源名**。

URN 也是 URI 的子集，但不同的是，URN 使用一个**名称**来定位资源，但是，虽然唯一地定义了资源，但是无法使用 URN 直接找到资源。

因此，通过 URN 定位的资源与位置无关，例如 `urn:ietf:rfc:2141` 命名了 rfc 的某个文档。

## 总结

综上，URI, URL, URN 三者的关系如下：

![relationship among URI, URL, URN](https://img-blog.csdnimg.cn/20210315224800113.png)

## More

更权威的参考：[RFC 3986](https://tools.ietf.org/html/rfc3986)
