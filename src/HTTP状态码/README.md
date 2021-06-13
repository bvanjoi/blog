# HTTP 状态码

当客户端发出网络请求后，服务器处理请求完成，会返回一个响应体，在响应头中包含状态码，表示此次请求的状态。

## 1xx

请求已经被服务器接受，但还是需要一些处理。

## 2xx

请求成功。

|2xx|description|
|-|-|
|200| 请求成功|
|200(from cache)|强缓存|

## 3xx

重定向。

|3xx|description|
|-|-|
|301 Moved Permanently|永久重定向|
|302 Found|临时重定向|
|304 Not Modified|协议缓存，被服务器告知可以使用本地缓存|

## 4xx

客户端请求出错。

|4xx|description|
|-|-|
|400 Bad Request|格式错误导致服务器无法处理|
|403 Forbidden|服务器拒绝执行|
|404 Not Found|资源路径不存在|

## 5xx

服务器出错。

|5xx|description|
|-|-|
|503 Service Unavailable|服务器过载/维护导致不可用|
|504 Gateway Timeout|网关请求超时|
