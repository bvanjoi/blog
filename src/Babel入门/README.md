# Babel 入门

## 介绍

Babel 是一个语法转换器，其主要功能是将较新的 JavaScript 语法转化为低版本的语法，以实现不同浏览器的兼容。

例如：

对于 ES6 中最常使用的 `let` 和 `arrow function`, 依然存在一定兼容问题：

![箭头函数的兼容性](https://img-blog.csdnimg.cn/20210506232634854.png)

> 在 IOS 9.1 以下的浏览器中，部分 ES6 语法依然无法使用。

此时，便可以使用 Babel 将 ES6 转化为 ES5 语法。

下面，我们将给出示例。

## 环境配置

对于入门的 Babel 用户，可以先下载三个依赖：

```bash
yarn add -D @babel/core @babel/cli @babel/preset-env
```

- `@babel/core`: Babel 编译功能的核心。
- `@babel/cli`: Babel 的命令行工具。
- `@babel/preset-env`: Babel 的插件预设。

> 自 Babel 7 后，Babel 官方采用了统一的 @babel/xxx 的命名方式。

## 处理

在项目目录下新建 `index.js` 文件，其内容为：

```javascript
// es6
const add = (num) => num + 1;
```

随后，输入命令行：

```sh
npx babel ./index.js -o output.js --presets=@babel/preset-env
```

执行后，将会在同级目录下生成 output.js 文件，其内容为：

```javascript
"use strict";

var add = function add(num) {
  return num + 1;
};
```

## 配置 Babel

在命令行内输入大量参数的方式太过繁琐，Babel 提供了一系列配置文件：名为 `babel.config.js`, 当然，也可以是 `.babelrc`, `.babelrc.json`, `babel.config.json`, 甚至在 `package.json` 中添加 `babel` 字段。

这些方式在格式、优先级上虽有些许不同，但目的是一致的：配置 Babel, 以实现相应的代码转换。我们以 JavaScript 配置文件为例。同时，它们用法也大致相同。

在项目根目录下创建 `babel.config.js` 文件，常见的字段有两个：

```js
module.exports = {
  presets: [],
  plugins: []
}
```

- `presets`: 包含了一系列的 Babel plugins 或者配置项。官网提供的几个常用的预设有：
  - `@babel/preset-env`: 转译 ES6.
  - `@babel/preset-typescript`: 转译 TypeScript.
  - `@babel/preset-react`: 转译 React
- `plugins`: 提供可插拔的插件机制，以使得按需转译代码。

在本文中，可以将其配置为：

```js
module.exports = {
  presets: [
    "@babel/preset-env", 
  ],
}
```

随后，在终端输入：

```shell
npx babel ./index.js -o output2.js
```

`@babel/cli` 执行时会自动读取配置文件，并据此进行转译。

最终生成的 `output2.js` 与 `output.js` 一致。

## 颗粒

大部分情况下，使用 Babel 内置的 preset 的可以解决问题的，但是，依然存在很多情况，需要更加精细的 Babel 配置。

这些配置包括并不仅限于：

- 手动配置 `plugins`: preset 本质上是一系列配置的集合，用户也可以放弃使用 preset, 转而使用自己配置的 plugins.
- `preset` 与 `plugins` 选项配置：一般而言 presets 和 plugins 这些插件都可以进行一些配置，例如 `@babel/preset-env` 配置诸如 `targets` 等一系列选项。

  ```javascript
  module.exports = {
    presets: [
      [
        "@babel/preset-env",
        {
          loose: true, // 开启后，可以使得转换后的代码更加接近原始的 javascript
        }
      ], 
    ],
  }
  ```

- 基于环境定制 Babel 配置：在 `Babel.config.js` 中，可以添加字段 `env` 来区分不同的环境，`env` 字段可以在 process.env 中设置并获取

  ```javascript
  module.exports = {
    env: {
      development: {
        plugins: [...]
      },
      product: {
        plugins: [...]
      }
    }
  }
  ```

## 与其他工具配合

Babel 也可以与其他工具很好地配合，诸如用于打包的 webpack, 只需要引入 `babel-loader` 的 webpack 插件即可使用 babel.
