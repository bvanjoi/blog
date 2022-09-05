# 常见包管理工具的依赖管理策略

- npm 早期: v3 版本之前，npm 会将依赖以树的结构安装依赖，例如库 A 依赖 B, 则 npm install A 后的目录结构为：

  ```txt
  <root>/
  |- node_modules
  |  |- A
  |     |- node_modules
  |        |- B
  |           |- node_modules
  |           |- package.json
  |     |- package.json
  |- package.json
  ```

  这种策略最明显的问题就是冗余过多，浪费了极大的磁盘空间。

  v3 版本使用平铺结构来替换树状结构，同样 npm install A, 其结果为：

  ```
  <root>/
  |- node_modules
  |  |- A
  |     |- package.json
  |  |- B
  |     |- package.json
  |- package.json
  ```

  但这种策略下，幻影依赖（指用户引入了项目内 package.json 下没有声明包）的问题也凸显出来。

- npm v6: v6 版本最明显的变化是引入了 `package-lock.json` 文件，该文件的最大作用是描述当前安装行为中实际用到的版本。之前，仅依靠 `package.json` 下的语义化版本无法保证前后安装的包的版本一致，即使放弃语义化版本，使用固定的版本号，也无法保证其依赖的依赖的版本固定。

- yarn v1: yarn v1 对依赖的组织方式与 npm v6 类似，但在早期版本中，yarn 的并行下载使得安装速度远胜于 npm.

- yarn v2: yarn v2 内默认开启 PnP(Plug'n'Play) 与 Zero-Installs 两份功能。其中： - PnP 是指放弃 node_modules, 转而使用一份由 yarn 维护的映射表来安装、解析依赖。 - Zero-Installs 是指通过 git rebase 这种操作改变 package.json 后，不再需要执行 `yarn install` 来更新依赖，它通过维护一套压缩文件来实现该功能。
  另外，yarn v2 会在 package.json 内增加 `"packageManager": "yarn@3.x.y"` 的标记。目前 yarn v2 已被应用到一些大型项目中，例如 [Babel](https://github.com/babel/babel/blob/main/package.json#L20).

- pnpm: 它以软连接为基础来管理依赖：pnpm 将所有的依赖都安装到 `node_modules/.pnpm` 下，然后依据项目中 package.json 下的 deps/devDeps 等字段内的值，以软连接的形式将用到的依赖放到 `node_modules` 下。示例为：

  ```
  <root>/
  |- node_modules
  |  |- .pnpm
  |     |- A
  |        |- package.json
  |     |- B
  |        |- package.json
  |- A
  |  |- package.json # pointed to .pnpm/A/package.json
  |- package.json
  ```

另外，即使是相同的包管理器的不同版本也可能出现一些 break change, 但并非本文关注的重心。
