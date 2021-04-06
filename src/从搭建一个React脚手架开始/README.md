# 从搭建一个 React 脚手架开始

> 暂停一下，先学 node 去了。。。

## 什么是脚手架

通俗而言，脚手架就是将平时项目中所需的功能提前配置好，让开发人员更多地关注业务本身，来提高我们的开发效率。

目前，比较流行的 React 脚手架有：

- [create-react-app](https://github.com/facebook/create-react-app)
- [next](https://nextjs.org/)

### 脚手架执行流程

以 `create-react-app` 为例，我们可以在终端中输入 `create-react-app my-app --template typescript` 创建一个以 Typescript 作为模版的初始项目。

其指令含义如下：

- `create-react-app` 是环境变量下的一个软链接，它将调用 `node` 来执行全局 `node_modules` 下的 `create-react-app/index.js`. 随后的内容均为该库定义的参数。
- `my-app` 含义是指创建的项目的名称。
- `--template typescript`, `--template` 是一个选项，`typescript` 是该选项的参数。

随后，这段指令的执行流程如下：

1. 首先，在环境变量 $PATH 下查询是否存在 `create-react-app`, 若不存在，则返回 `No such file or directory`; 若存在，则执行。该步骤相当于 `which create-react-app`.
2. 随后，查找该软链接指向的文件，若指向的文件不存在，则返回 `No such file or director`; 若存在，则执行。该步骤相当于执行 `/usr/bin/env node usr/local/lib/node_modules/create-react-app/index.js`.

## 从 `yarn link` 开始

首先，给我们脚手架命名为 `b-create-react`, 随之，创建这个项目：

```sh
mkdir b-create-react && cd b-create-react
```

随后，再命令行输入：

```sh
npm init --yes # --yes 是指直接生成默认的 package.json
```

随后，在 *package.json* 中指定执行命令的入口文件，添加如下的 `"bin"`字段：

```json
"bin": {
  "b-create-react": "./bin/index.js" // 一个指向入口的软连接
},
```

之后，既然设定了入口文件，那么就创建文件与文件夹：

```sh
mkdir bin && cd bin
vim index.js && cd ..
```

而 `bin/index.js` 中的内容先可以暂定为：

```js
#!/usr/bin/env node
console.log("hello b-create-react");
```

此时，执行 `yarn link`, 将该库链接到全局，更多关于 `yarn link` 的内容可以参考：[从 npm link 到 lerna](../从npm%20link到lerna/README.md)。

随后，我们在本地的任何位置均可以使用指令 `b-create-react`, 其运行效果为输出：`hello b-create-react`.

在这一部分中，我们创建了一个全局可以调用的命令，接下来，我们将关注如何让该命令接受参数。

## 用命令行创建一个项目

首先明确，当在命令行输入 `b-create-react --version` 返回 `b-create-react/package.json` 中的 `version` 字段。

### 第一个问题：如何接受 `--version` 参数？

在 node 中，提供了模块 `process`, 其中 `process.argv` 返回一个数组，其中包含当 Node.js 进程启动时候传入的参数：

将 `./bin/index.js` 更改为

```js
#!/usr/bin/env node
const argv = require('process').argv;
console.log(argv);
```

则执行命令 `b-create-react --version`, 其输出为：

```javascript
[
  '/Users/computer/.nvm/versions/node/v14.5.0/bin/node', // node 进程的绝对路径
  '/usr/local/bin/b-create-react', // 正在被执行的 js 文件路径
  '--version' // 额外参数
]
```

由此可知，我们可以截取 `argv.slice(2)` 来获取所有输入的参数。

### 获取 package.json 中的 `version` 字段

## 开始书写脚手架模版

那么，既然要开发一个脚手架，首先思考这个脚手架能提供什么：

- ES6, tsx, jsx 的语法解析，因此需要 babel.
- 打包、热更新、模块化，因此需要 webpack.
- 单元测试，因此需要 jest.
- 语法检查、代码格式化，因此需要 eslint, prettier.
- git 时的 commit 检查，因此需要 husky.

对此，我们首先提供一个模版：[b-react](https://github.com/bvanjoi/b-react)

## 发布

在项目的根目录下，执行：

```bash
npm login # 登入 npm 账号
npm publish
```

随后，便被发布到 npm 社区中。
