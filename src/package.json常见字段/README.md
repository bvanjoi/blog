# package.json 常见字段

npm 中 `package.json` 文件用来声明该目录为一个包。

创建 `package.json` 的方式有很多种：

- 手动创建；
- `npm init` 进行配置式创建；
- `npm init -y` 快速创建；

本文主要讨论 `package.json` 中各个字段的作用。

## 字段

### 必选项：`name` 与 `version`

在 `package.json` 中必须填写：

- `name`: 该包的名字，需要满足 `^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$` 正则规则，即必须为小写字母，数字，下划线，连字符, @ 组成的字段。同时还应不超过 214 个字符。
- `version`: 该包当前的版本，形式为 `x.y.z`, 并且需要遵循语义化要求。
  版本语义化是指：
  
  1. 对于新项目，建议版本为 `1.0.0`;
  2. Patch 版本：bug 修复的版本迭代建议增加第三个字段，例 `1.0.1`;
  3. Minor 版本：功能性引入但 API 兼容建议增加第二个字段，例 `1.1.0`;
  4. Major 版本：破坏性升级（例如出现 API 不兼容的问题），建议升级第一个字段，例 `2.0.0`.

例如：

```json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

### 命令 `script`

- `script`: 对象类型，其键是自定义的快捷命令，值是命令的内容。

例如，如果使用 webpack-dev-serve 来实现热更新，则每次启动项目需要使用 `npx webpack serve` 来进行加载。

为了方便，可以在 package.json 文件中配置：

```json
{
  "script": {
    "dev": "webpack serve"
  }
}
```

随后，每次启动项目，只需要 `yarn dev` 或 `npm run dev` 即可。

### 配置字段 `config`

- `config`: 对象类型，可以用于添加命令行的环境变量。

例如：

```json
{
  "config": {
    "port": 8080
  }
}
```

### 包依赖 `dependencies` 与 `devDependencies`

二者的类型均为对象，存储了当执行 `npm install` 或者 `yarn` 时需要下载的包，其中：

- `dependencies`: 在生产环境下用到的库，例如 `react`, `react-dom` 等；
- `devDependencies`: 仅仅在开发、测试阶段用到的库，例如 `jest`, `webpack`, `eslint`, `babel` 等。

下面来看具体用法，例如我们引入了 `react`, `eslint`, `webpack`, `lerna`  这几个包，则配置可以为：

```json
{
  "dependencies": {
    "react": "~17.0.2",
  },
  "devDependencies": {
    "eslint": "*",
    "webpack": "^5.34.0",
    "lerna": "4.0.0"
  }
}
```

- `"react": "~17.0.2"`: 是指获取最新的 Patch 版本，即修复一些 bug 的版本；
- `"eslint": "*"`: 是指拉取最新的 Major 版本，即最新的大版本，可能存在 API 的破坏性改动；
- `"webpack": "^5.34.0"`: 是指拉取最新的 Minor 版本，即可能增加新功能，但不会引起 API 破坏性变动；
- `"lerna": "4.0.0"`: 指定 `4.0.0` 版本。

当然，依赖的版本控制的方法远比上述多很多。

甚至也可以通过 `file` 来指向本地，例如 `foo: file:../foo`.

### `peerDependencies`

- `peerDependencies`: 简单而言，该字段用于防止多次引入相同的库。

例如，某个项目存在依赖 A, 而 A 项目中的 `peerDependencies` 包含字段 B, 则 `npm install` 之后的目录结构为：

```txt
|-node_modules
|---A
|---B
```

### `peerDependenciesMeta`

- `peerDependenciesMeta`: 作为 `peerDependencies` 的辅助字段，可以告知包管理工具更多信息。

### `bundledDependencies`

- `bundledDependencies`: 一个字符串数组，其中的内容属于 `dependencies` 或 `devDependencies` 的子集，当使用 `npm pack` 打包时候，会将其中的库也打包其中。但是 `npm publish` 发布时，该字段会被忽略。

### `optionalDependencies`

在 `dependencies` 中定义的库，如果安装失败，项目便会跑出错误并停止执行。

- `optionalDependencies`: 对象类型，其中存储的依赖即使安装失败也不会导致项目中止运行。当然，需要在代码中做好兜底。

### 脚本文件 `bin`

当库作为可执行文件时的配置项，例如 cli 工具。

- `bin`: 对象类型，规定了可执行文件名，以及该可执行文件对应的软链接。

例如：

```json
{
  "bin": {
    "app": "./bin/index.js"
  }
}
```

### 工作目录 `workspaces`

- `workspaces`: 该字段可以实现多仓库下的包管理，可以简化 `npm link`, `npm install` 等流程。

例如，在根目录下的 `package.json` 为

```json
{
  "name": "root",
  "workspaces": [
    "workspace-a",
    "workspace-b"
  ]
}
```

则整体的项目结构为：

```txt
|root
|-- package.json
|---- workspace-a
|------ package.json   
|---- workspace-b
|------ package.json   
```

当在根目录执行 `npm install` 时，`workspace-a`, `workspace-b` 会被软链接到根目录的 `node_modules` 下。

此时，定义好子仓库下的 `package.json` 中的 `dependencies` 字段，便可以在 `workspace-b` 下引入 `workspace-a`, 相反亦可。

当然，mono-repo 还有更多优秀的实现，例如 lerna 管理工具。

### 入口文件 `main`

- `main`: 字符串类型，指明该包被引用时入口的路径。浏览器环境和 node 环境均可以使用。

### `browser`

- `browser`: 客户端环境下的入口。当客户端渲染时，该字段会替代 `main` 字段。

### `module`

- `module`:  ESM 规范下的入口文件，浏览器环境和 node 环境均可使用。

### `publicConfig`

- `publicConfig`:对象类型，发布时的配置，可以指定发布的网站(register)，权限(access)

### 发布配置文件 `files`

- `files`: 字符串数组，用以描述 `npm publish` 时候推送到 `npm` 上的文件列表。

例如：

```json
{
  "file": [
    "dist"
  ]
}
```

另外，当执行 `npm publish` 时，有一些文件是必须被上传，例如 `README`, `package.json` 等；相反，有一些文件会永久被忽略，例如 `.git`, `.npmrc` 等。

### 描述字段 `description`

- `description`: 字符串类型，该字段用于描述当前的包。如果当前目录存在 README.md 时，当执行 `npm init -y` 初始化 `package.json` 时，会自动读取 README.md 中的内容到 `description` 字段。

### 仓库信息 `repository`

- `repository`: 对象类型，用以描述远端仓库的信息。

### 私有字段 `private`

- `private`: 布尔类型，当其值为 `true` 时，表明该包为私有仓库，`npm publish` 等发布命令时将被拒绝执行。

### 许可证类型 `license`

- `license`: 字符串类型，指定该包遵循的许可证，常见类型有：`Apache`, `BSD`, `GUN`, `MIT`, `MPL` 等

### 关键字 `keywords`

- `keywords`: 字符串数组类型，方便使用 `npm search` 命令查询。

### 首页 `homepage`

- `homepage`: url 字符串，指向首页地址；

### bugs

- `bugs`: 对象类型，其中存储了 email, url 等可供联系的字段以保证用户可以反馈，例如：

```json
{
  "bugs": {
    "url" : "https://github.com/owner/project/issues",
    "email" : "project@hostname.com"
  }
}
```

### 作者字段 `author`, `contributors`

- `author`: 字符串类型，用以标注作者姓名、邮箱、网址等；
- `contributors`: 字符串数组类型，用于标注一系列贡献者。

### 赞助 `funding`

- `funding`: 对象类型，里面记录了地址等信息，使得用户可以使用这些信息来给作者进行赞助。

### `man`

- `man`: 指明 man 文档的位置。

### `directories`

- `directories`: 一个对象，用以描述目录结构。

例如：

```json
{
  "directories": {
    "bin": "./bin",
    "doc": "./doc",
    "lib": ".lib"
  }
}
```

### `engines`

- `engines`: 对象类型，可以约束环境。

例如，下列配置约束了 node 的最低版本：

```json
{
  "engines": {
    "node": ">=12",
  }, 
}
```

### `os`

- `os`: 字符串数组，指定包运行的操作系统上。

### `cpu`

- `cpu`: 字符串数组，指定包运行的 CPU 架构。

### `exports`

- `exports`: 约束了通过 **`node_modules` 引入**或**自我引用**或者的库的入口文件，其类型为 `Object | string | string[]`.

例如：

```json
{
  "name": "a",
  "exports": "./lib-a.js"
}
```

则 `require("a")` 会寻找 `./lib-a.js`. 同时由于 `exports` 限制了其他文件的导出，因此 `require('a/xxx')` 会失败。

再例如：

```json
{
  "name": "a",
  "exports": ["./lib-a.js", "./lib-b.js"]
}
```

此时 `require("a")` 会依次寻找 `./lib-a.js` 和 `./lib-b.js`, 哪个文件存在则返回哪个。

再比如：

```json
{
  "name": "a",
  "exports": {
    ".": "./lib-a.js",
    "./utils/*": "./src/*"
  }
}
```

此时 `require("a")` 会寻找 `./lib-a.js`; `require("a/utils/index.js")` 会寻找 `./src/index.js`.

另外，`exports` 对象还可以是嵌套对象，例如：

```json
{
  "name": "a",
  "exports": {
     "./utils/": {
            "browser": {
                "webpack": ["./", "./node/"],
                "default": {
                    "node": {
                        "webpack": ["./wpck/"]
                    }
                }
            }
        }
  }
}
```

此时，需要结合 condition_name 来使用。

需要注意的是，`exports` 字段存在一定限制，例如对象中不能混合使用相对路径和 conditional_name, 不能使用绝对路径， "default" 字段需要放到对象的最后。

更详细可见 (package.json 中与 resolve 相关的字段)[../package.json中与resolve相关的字段/README.md]。

### `imports`

`imports` 字段是一个对象，它负责将指定引入的文件映射到其余的包或文件上。

需要注意的是，`imports` 对象中的每个 key 必须以 `"#"` 开头。

更详细可见 (package.json 中与 resolve 相关的字段)[../package.json中与resolve相关的字段/README.md]。


## 总结

除了上述字段之外， `package.json` 还可以作为配置文件来添加不同的配置项。这里无法一一陈述，需按照相应第三方库的官网对照学习。
