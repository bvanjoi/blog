# 从示例来看 Ajax

Ajax: Asynchronous JavaScript and XML, 它是指，再不刷新页面的情况下与服务器交换数据，随后更新页面。

实际操作中，是使用 `XMLHttpRequest` 对象与服务器通信。

> 尽管名词中的 XML 表示与服务器之间的通信为 XML, 但实际上早已用 JSON 替换为 XML.

## 示例

> 后端框架：nest.js

假设后端内容为：

```js
import { Controller, Get, Header, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('Access-Control-Allow-Origin', '*') // cors 解决跨域问题
  getHello(): string {
    return JSON.stringify({
      info: 'get hello',
    });
  }

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  getInfo() {
    return JSON.stringify({
      info: 'post hello',
    });
  }
}
```

随后，新建 `index.html`, 内容如下：

```html
<head>
 <title>Ajax-learn</title>
 </head>
 <body>
 <div>
  <button id="get">click to get info</button>
  <button id="post">click to post info</button>
  <div id="info"></div>
  <script>
  document.getElementById('get').onclick = function() {
   /** 创建 XHR 实例 */
   const xhr = new XMLHttpRequest();
   // 创建一个 GET 请求，指向后端地址
   // 127.0.0.1:3000 表明后端服务在本地的 3000 端口上
    xhr.open('GET', 'http://127.0.0.1:3000/');
   // 设置请求头
   // Content-Type 为 HTP 预设好的
   xhr.setRequestHeader('Content-Type', 'text/plain')
    // 发送请求
    xhr.send();
    // 当 readyState 发生变化时的处理
    xhr.onreadystatechange = function() {
    // readyState:
    // 0: UNSENT 代理被创建，但是没有调用 open 方法
    // 1: OPENED 已经调用 open 方法
    // 2: HEADERS_RECEIVED 已经调用 send 方法，并且同步和状态已经可获取
    // 3: LOADING 下载中，responseText 已经包含部分数据
    // 4: DONE 操作完成
    if (xhr.readyState !== 4) {
      return ;
    }
    if (xhr.status === 200) {
     document.getElementById('info').innerHTML += xhr.response
    }
    }
  }

  document.getElementById('post').onclick = function() {
   const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:3000/');
   xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send();
    xhr.onreadystatechange = function() {
    if (xhr.readyState !== XMLHttpRequest.DONE) {
      return ;
    }
    if (xhr.status >= 200 && xhr.status < 300) {
     console.log(xhr.response)
     document.getElementById('info').innerHTML += xhr.response
    }
    }
  }
  </script>
 </div>
 </body>
```

效果为：

![发送 GET 和 POST 的效果](https://img-blog.csdnimg.cn/20210614163701653.gif)

## 设定响应数据的类型

在后端代码中，返回的是 JSON 类型，为了更好地处理该类型，可以添加以下代码：

```js
document.getElementById('post').onclick = function() {
 const xhr = new XMLHttpRequest();
 xhr.open('POST', 'http://127.0.0.1:3000/');
 xhr.setRequestHeader('Content-Type', 'text/plain')
 // 设定响应数据类型
 xhr.responseType = 'json'
 xhr.send();
 xhr.onreadystatechange = function() {+
 if (xhr.readyState !== XMLHttpRequest.DONE) {
  return ;
 }
 if (xhr.status >= 200 && xhr.status < 300) {
  document.getElementById('info').innerHTML += xhr.response.info // 当作 JSON对象处理
 }
 }
}
```

也可以：

```js
document.getElementById('post').onclick = function() {
 const xhr = new XMLHttpRequest();
 xhr.open('POST', 'http://127.0.0.1:3000/');
 xhr.setRequestHeader('Content-Type', 'text/plain')
 xhr.send();
 xhr.onreadystatechange = function() {
 if (xhr.readyState !== XMLHttpRequest.DONE) {
  return ;
 }
 if (xhr.status >= 200 && xhr.status < 300) {
  document.getElementById('info').innerHTML += JSON.parse(xhr.response).info // 仅仅做出解析
 }
 }
}
```

二者效果是一样的：

![解析 JSON](https://img-blog.csdnimg.cn/20210614164919889.gif)

## 其他功能

除此之外， xhr 还具有很多功能：

- 设置超时时间：`xhr.timeout = 2000`
- 取消请求： `xhr.abort()`

## 使用 axios

**axios 本质上是对 xhr 的 Promise 封装。**
