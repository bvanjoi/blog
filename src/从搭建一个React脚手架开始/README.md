# 从搭建一个 React 脚手架开始

## 什么是脚手架

脚手架通俗而言，就是将平时项目中所需的库提前配置好，让开发人员更多地关注业务本身，来提高我们的开发效率。

目前，比较流行的 React 脚手架有：

- [create-react-app](https://github.com/facebook/create-react-app)
- [next](https://nextjs.org/)

## 为什么重复造轮子

- 提高技术
- 满足个人开发需求

## 从 `package.json` 开始

首先，给我们脚手架命名为 `b-create-react`, 随之，创建这个项目：

```sh
mkdir b-create-react && cd b-create-react
```

随后，再命令行输入：

```sh
yarn init
```

执行之后，可以较为随意的填写交互内容，但仅仅初始化是不够的，我们需要在 *package.json* 增加命令来指定执行命令的入口文件，**增加**的内容如下：

```json
{
  "bin": {
    "b-create-react": "./src/index.js" // 一个指向入口的软连接
  },
}
```

既然设定了入口文件，那么就创建文件与文件夹：

```sh
mkdir src && cd src
touch index.js && cd ..
```

## 开始书写脚手架

那么，既然要开发一个脚手架，首先思考这个脚手架能提供什么：

- ES6, tsx, jsx 的语法解析，因此需要 babel.
- 打包、热更新、模块化，因此需要 webpack.
- 单元测试，因此需要 jest.
- 语法检查、代码格式化，因此需要 eslint, prettier.
- git 时的 commit 检查，因此需要 husky.

对此，我们首先提供一个模版：[b-react](https://github.com/bvanjoi/b-react)

> 暂停一下，先学 node 去了。。。
