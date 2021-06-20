# 浏览器中的已拦截弹窗

当使用浏览器时，经常能见到下列标志：

![已拦截弹窗提示](https://img-blog.csdnimg.cn/20210620191248999.png)

其实，当页面中出现用户非主动性的弹窗就会出现该提示，例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>intercepted</title>
</head>
<body>
 <script>
  window.open('www.baidu.com')
 </script>
</body>
</html>
```
