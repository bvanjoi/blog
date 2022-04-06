# RushJS 中使用 commit-lint

> RushJS 是管理 JavaScript monorepo 的一个方案，官网为：https://rushjs.io/.

本文通过引入 commit-lint 来介绍 Rush 中的一些概念和用法。

## RushJS 内安装 commit-lint

由于 Rush 仓库下的根目录没有 node_modules, 所以当需要使用诸如 prettier, commit-lint 这些针对仓库全局的指令时，就需要遵从 Rush 自身设计。

此时，可以执行 `rush init-autoinstaller --name commit-lint`, 该命令会在 `config/autoinstallers` 目录下增加一个名为 `commit-lint` 的文件夹。

> config/autoinstallers 文件夹用于管理 `rush update` 无法涉及到的依赖，它可以实现诸如全局命令这样的功能。

随后，在 `config/autoinstallers/commit-lint` 下执行 `pnpm i @commitlint/cli`, 并在该目录下创建 `commitlint.config.js`, `index.js` 两个文件，此时，目录结构为：

```js
| commit-lint
  | index.js
  | commitlint.config.js
  | package.json
```

- `commitlint.config.js` 是 commitlint 默认读取的配置文件，可以参考https://commitlint.js.org/#/reference-configuration.
- `index.js` 是一个脚本，它的作用是调用 commitlint, 其内容可以是：

```js
const path = require('path');
const { execSync } = require('child_process');

const gitPath = path.resolve(__dirname, '../../../.git');
const configPath = path.resolve(__dirname, './commitlint.config.js');
const commitLintBinPath = path.resolve(__dirname, './node_modules/.bin/commitlint');

main();

function main() {
  const commitLintArgs = [
    commitLintBinPath,
    '--config',
    configPath,
    '--cwd',
    path.dirname(gitPath),
    '--edit',
  ];
  // run commit lint
  execSync(`bash ${commitLintArgs.join(' ')}`, {
    stdio: 'inherit',
  });
}
```

针对 `index.js`, 有一些需要注意的点：

- 由于没有处于根目录下，因此需要指定 git 目录；
- 该文件的作用是唤醒 commitlint, 因此使用 shell, python 等语言。

## 注册 commitlint 命令

随后，在 `common/config/rush/command-line.json` 中的 `commands` 字段内注册相应的命令：

```json
{
  commands: [
    {
      "name": "commitlint",
      "commandKind": "global",
      "autoinstallerName": "commit-lint",
      "summary": "Invokes commitlint to lint commit message.",
      "shellCommand": "node common/autoinstallers/commit-lint/index.js"
    }
  ]
} 
```

`shellCommand` 字段的作用就是调用前一步实现的脚本；其他参数的含义可以参考 [command line](https://rushjs.io/pages/configs/command-line_json/).

最后，执行 `rush update`.

## 在 Git 钩子内执行 commitlint

`common/config/git-hooks` 文件夹用于存放不同的 git hook, 我们只需要在其中创建 `commit-msg` 的文件（注意不是 commit-msg.sample），其内容是：

```shell
#!/bin/sh

node common/scripts/install-run-rush.js commitlint || exit $? #++
```

就可以在 commit 阶段调用 lint 工具了。

> install-run-rush.js 是由 Rush 生成的脚本，它用于调用 Rush.

## 总结

总体来看，上述流程为：

```
| git commit |  --> | invoke rush command | --> | invoke autoinstaller | --> | invoke commitlint |  --> | check commit message |
```