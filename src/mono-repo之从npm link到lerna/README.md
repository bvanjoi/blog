# mono-repo 开发之从 npm link 到 Lerna

首先，mono-repo 是指包含多个 packages. 但远端只有一个 git 仓库的仓库。

## npm 是什么

npm 是 JavaScript 运行时 Node.js 的包管理工具，它极大地促进了 JavaScript 社区的繁荣。

npm 有两个主要的组成部分：

- 托管 JavaScript 的在线网站: <https://www.npmjs.com/>
- 用于包管理的 CLI 工具。

本文，就主要来探索 mono-repo 的调试和管理。

## npm link

首先介绍 `npm link` 命令，该指令的作用是为某个库创建软链接。

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
将会看到一段链接成功的信息。

随后，在该目录下创建一个 index.js 脚本文件，并输入其内容为 `require('npm-lib');`, 随后执行 `node index.js`, 可以看到输出：

```txt
in npm-lib
```

这表明，在本地，`npm-lib` 已经作为库被 `npm-test-lib` 引用。

上述示例的最终的目录结构如下：

![npm link 示例](https://img-blog.csdnimg.cn/20210405170034509.png)

### 需要注意的点

注意，我们在 `npm-test-lib` 下调用了库 `npm-lib`, 但是，由于此时该库并非通过 `npm install` 的方式下载的，所以需要在 `npm-test-lib` 的 `package.json` 的 `dependencies` 字段中添加： `npm-lib: <@version>` 内容。

## Lerna

### npm link 的痛点

上述介绍的 `npm-lib` 和 `npm-test-lib` 的库时，我们通过将 `npm-lib` 指向全局，并在 `npm-test-lib` 中引入了 `npm-lib`.

以上操作，一共调用了两次 `npm link`, 虽然不多，但很繁琐。当 packages 的数量达到一定程度时，项目的开发、维护、上线就变得非常困难。

因此，为了解决上述痛点，使用 Lerna 管理 packages.

### Lerna 是什么

官方给自己的定义是：

> Lerna, a tool for managing JavaScript projects with multiple packages.

同时，官方还明确指出了：

> Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

简而言之，Lerna 是管理基于 git 和 npm 的多 package 项目的工具。

### 安装与快速开始

可以通过 npm 来安装 Lerna:

```bash
npm install -g lerna  # 全局安装 lerna
mkdir lerna-repo && cd lerna-repo # 新建并进入文件夹
lerna init  # 对该文件夹进行 lerna 初始化
```

## Lerna 项目的整体流程

如下图所示：

![lerna 项目整体流程](https://img-blog.csdnimg.cn/20210410151056616.png)

同样以 `npm-lib` 和 `npm-test-lib` 为例，我们来看二者有何不同：

### 项目初始化

```bash
mkdir lerna-learn && cd lerna-learn
lerna init
```

初始化完毕后，仓库的目录结构如下：

![after init](https://img-blog.csdnimg.cn/20210410160004153.png)

此时，`packages` 目录下空无一物。

我们可以使用 `lerna create` 来创建新的 packages, 在根目录下执行：

```bash
lerna create lib 
# 一路回车
```

再创建一个调用 `lib` 的 package:

```bash
lerna create test-lib 
# 一路回车
```

此时，仓库的样式为：

![after create packages](https://img-blog.csdnimg.cn/20210410160558949.png)

此时，打开 `packages/lib/package.json`, 可见其中规定入口文件的字段：`"main": "lib/lib.js"`, 我们对 `packages/lib/lib/lib.js` 修改：

![change lib.js](https://img-blog.csdnimg.cn/20210410162157286.png)

随后，增加 `packages/test-lib/package.json` 的依赖字段：

![add dependencies in test-lib](https://img-blog.csdnimg.cn/20210410162532591.png)

其中：

- "lib" 对应 `packages/lib/package.json` 中的 name 字段。
- "0.0.0" 对应 `packages/lib/package.json` 中的 "version" 字段，用于版本管理。

> 在我们的项目中，这两个字段的配置都非常简陋，实际工程中需要较为规整的配置

之后，在项目根目录下执行 `lerna link`, 即可以在 test-lib 中引入 lib 的代码，此时，目录结构为：

![after lerna link](https://img-blog.csdnimg.cn/20210410163010425.png)

可见，在 `test-lib` 下多了 `node_modules`, 其中 `node_modules/lib` 即为指向 `packages/lib` 的软链接。

最后，我们可在 `packages/test-lib` 中调用 `packages/lib` 的内容：

![执行 test-lib 内的脚本](https://img-blog.csdnimg.cn/20210410163428794.png)

## 总结

从本地库的引入即可看出，Lerna 极大地提高了开发效率。
