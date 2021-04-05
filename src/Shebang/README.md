# Shebang

Shebang, 也被称为 Hashbang, Linux 中国翻译组的人员将其翻译为*释伴*。

Shebang 是指字符序列 `#!`, 它一般放在文件首行的前两个字符，它用来标识执行该文本需要用哪个解释器来执行。

## 从可执行文件开始说起

假如有以下 hello.c 代码：

```cpp
#include <stdio.h>

int main() {
  printf("hello world");
  return 0;
}
```

可以使用 `gcc hello.c` 来生成可执行文件 `a.out`, 随后在命令行输入 `./a.out` 便可以打印出 `hello world`.

这是因为 `gcc` 最终的产物为一个可执行文件，我们可以直接运行它。

但是，如果要执行 js 这种脚本文件呢？

## 用 Shebang 来指定解释器

假设有以下 index.js 代码：

```js
console.log('hello world');
```

当输入以下命令执行时：

```bash
chmod 777 index.js # 加权限
./index.js
```

会报错：

```txt
./index.js: line 1: syntax error near unexpected token `'hello world''
./index.js: line 1: `console.log('hello world');'
```

这是当执行 `./index.js` 命令时默认使用了 `shell` 的解释器。

如果想运行 js 脚本，则可以使用 `node ./index.js`, 这样是将 `index.js` 交给 `node` 来执行。

那么现在，问题就转化为：如何使得 `./index.js` 等价于 `node ./index.js`.

Shebang 就是解决该问题的，我们只需要在文件首行加上 `#!/usr/bin/env node` 即可：

```javascript
#!/usr/bin/env node
console.log('hello world');
```

此后，执行 `./index.js` 可以直接看到输出。

接下来来看首行的含义：

- `#!`, 为 Shebang 的标识；
- `/usr/bin/env node`, 其实，并不存在 `/usr/bin/env` 这个路径，它是告知系统，需要在环境变量中寻找 `node` 这个软链接，之后使用 `node` 这个解释器来解释 `index.js`.

## 加载其他文件

同样，Shebang 可以应用到其他类型的脚本：

例如 python 脚本：

```python
#! /usr/bin/env python3
print("Hello world")
```

例如 shell 脚本

```shell
#! /bin/bash
echo "Hello World"
```

> `#! /bin/bash` 是指绝对路径，而不是从 $PATH 中寻找解释器。
