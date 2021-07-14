# 跨域问题

## 同源策略

- 同源：如果两个 URL 的协议(protocol)、端口(port)、域名(host) 都相同的话，则这两个 URL 同源。

同源策略是**浏览器**的安全机制（思考，如果没有该策略限制，则不同源的 Cookie, DOM, Storage 等等都可以被随意访问）。

> 浏览器才有同源策略，客户端、服务端该策略不受影响。

## 跨域

当违背同源策略时，就会出现跨域问题：

![访问本机不同端口下的服务的跨域问题](https://img-blog.csdnimg.cn/20210614182444710.png)

## 解决同源策略的方法

### JSONP

在 HTML 中，有一些标签不受同源策略的限制，例如 script, img 等标签（所有标签可见：<https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy>），通过其中的 src 属性可以引入不同源的连接。

借助上述方法，引申出 JSONP 方法：

```html
<head>
 <title>Ajax-learn</title>
 </head>
 <body>
 <div>
  <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script>
   document.write(React.useState.toString())
  </script>
 </div>
 </body>
```

可见，下图中的 url 为 file 协议，网络请求为 https 协议，必然不同源，但是依旧可以正常请求。

![script 实现跨域的效果](https://img-blog.csdnimg.cn/20210614190435992.png)

> 由于 HTML 的特点，JSONP 只支持 GET 方法。

## CORS, 跨域资源共享

CORS 属于 W3C 标准，它通过允许服务器标示除了它自身之外的 origin 来解决跨域问题，对于已经表示的域名，浏览器便不再做同源处理。

在 [从示例看 ajax](../从示例来看Ajax/README#示例) 一文中已经用到该技术：

```js
@Get()
@Header('Access-Control-Allow-Origin', '*') // cors 解决跨域问题
getHello(): string {
 return JSON.stringify({
  info: 'get hello',
 });
}
```

## 代理服务器

当有跨域请求时，可以先将请求发送给代理上，再让代理转发给服务器。例如 charles, webpack-dev-server 等。

- 正向代理；
- 反向代理：nginx.
