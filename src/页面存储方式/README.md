# 页面存储方式

由于 HTTP 的无状态特性，所以不得不使用其他方式来存储信息。

## cookie

cookie 是指存储在页面的一份数据(<4kb), 当用户访问页面时，会被浏览器携带并发送到服务器上，借此实现了页面状态的保存。

可以通过 `document.cookie` 来获取当前页面的 cookie.

cookie 中有一些重要的选项：

- `path`
- `domain`
- `expires`, `max-age`
- `secure`
- `samesite`: cookie 的安全选项，可以防止跨站脚本攻击。
- `httpOnly`

## Storage

Storage 具有一系列特性：

- 不会过期；
- 存储上线一般为 5MB;
- 不同于 cookie, 不会被 HTTP 携带发送。

localStorage 和 sessionStorage 提供了相同的方法：

- `setItem(key, value)`
- `getItem(key)`
- `removeItem(key)`
- `clear()`
- `key(index)`
- `length`

### localStorage

- 同源的页面之间共享数据。
- 可以长期保留的数据。

### sessionStorage

- 只存储在当前标签页面。
- 页面关闭后即消失。

## Service Workers

PWA 中介绍了 service workers, 其功能是拦截所有的网络请求，进行判断是否需要发起网络请求，还是使用本地缓存。

## IndexDB

indexDB 是存储在客户端的  NoSQL 数据库，用它可以实现数据持久化。

##
