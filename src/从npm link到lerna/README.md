# 从 npm link 到 lerna

## npm 是什么

npm 是 JavaScript 运行时 Node.js 的包管理工具，它极大地促进了 JavaScript 社区的繁荣。

npm 有两个主要的组成部分：

- 托管 JavaScript 的在线网站: <https://www.npmjs.com/>
- 用于包管理的 CLI 工具。

本文，就主要来探索本地多个包存在时，如何更方便地进行调试和管理。

## npm link

为此，首先需要介绍 `npm link` 命令，该指令的作用是为某个包创建软链接。

它的主要用法有两种：

1. 当位于某个带有 `package.json` 的模块时，执行 `npm link` 可以将该库在本地的全局范围内创建一个软链接。
2. 在某个模块下，执行 `npm link [<@scope>/]<pkg>[@<version>]`, 可以引入名为 `pkg` 的模块的软链接。

### 示例

```bash
mkdir npm-lib && cd npm-lib # 创建名为 npm-lib 的链接并进入
npm init -y # 生成默认 package.json 文件
```

此时，`npm-lib/package.json` 中有一条名为 `main` 的字段，它的值为 `index.js`, 它表明该库的入口文件。

![main in package.json](https://img-blog.csdnimg.cn/20210405164651959.png)

之后使用指令 `vim index.js`, 并写下代码 `console.log('in npm-lib')`, 随后保存并退出，返回到 `npm-lib` 目录下。

执行 `npm link`, 最终会输出一段  `[全局目录]/lib/node_modules/npm-lib -> [当前目录]/npm-lib` 的文本，表示全局的 `npm-lib` 已经指向这里。

随后，执行 `cd ..` 返回到上级目录，

再创建一个目录：`mkdir npm-test-lib && cd npm-test-lib`, 随后执行 `npm link npm-lib`.
将会看到一段类似链接信息。

随后，在该目录下创建一个 index.js 脚本文件，并输入其内容为 `require('npm-lib');`, 随后执行 `node index.js`, 可以看到输出：

```txt
in npm-lib
```

这表明，在本地，`npm-lib` 已经作为库被 `npm-test-lib` 引用。

上述示例的最终的目录结构如下：

![npm link 示例](https://img-blog.csdnimg.cn/20210405170034509.png)

### 需要注意的点

注意，我们在 `npm-test-lib` 下调用了库 `npm-lib`, 但是，由于此时该库并非通过 `npm install` 的方式下载的，所以需要在 `npm-test-lib` 的 `package.json` 的 `dependencies` 字段中添加： `npm-lib: <@version>` 内容。
