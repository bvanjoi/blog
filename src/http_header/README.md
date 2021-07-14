# HTTP headers

## request headers

- Accept: 浏览器可接受的数据格式；
- Accept-Encoding: 浏览器可以处理的压缩算法，例如 gzip.
- Accept-Language: 浏览器可以处理的语言。
- Connection: keep-alive: 长链接，一次 TCP 重复使用。
- Cookie: 当前页面的 Cookie, 存储登录态等信息；
- Host: 请求域名；
- User-Agent(UA): 浏览器信息；
- Content-Type: 数据类型，例如 application/json.

## response headers

- Content-Type: 返回的数据类型，例如 application/json.
- Content-length: 返回数据大小；
- Content-Encoding: 返回数据的压缩算法，例如 gzip.
- Expires: 过期时间；
- Set-Cookie:
- TraceID:
- Cache-Control: max-age=time, no-cache, no-store. 资源是否被缓存；max-age 后面的时间为缓存时间（秒）

## 自定义 header
