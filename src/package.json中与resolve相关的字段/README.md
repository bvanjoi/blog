# package.json 中与 resolve 相关的字段

当在 Node 中通过 `require` 或者 `require.resolve` 来解析一个文件时，Node 首先会到找最近的 `package.json` 文件并对其进行[处理](https://github.com/nodejs/node/blob/master/lib/internal/modules/esm/resolve.js#L1213)。本文将来梳理 `package.json` 中与 resolve 相关的字段及其功能。

## 入口文件字段 `main`

`main` 字段约定了库的入口，例如文件夹 `a` 的目录结构如下：

```
|- a
|--- src
|----- index.js
|--- index.js
|--- package.json
```

当 package.json 中的 `main` 为 `src/index.js` 时，`require('./a')` 将会加载 `<your_path>/a/src/index.js`.

而如果 `main` 的值为空，或者指向了一个不存在的文件，则 `require('./a')` 会把 `a` 当作一个目录来依次解析 mainFiles 和 extensions 的组合，在 node 中，mainFiles 的纸为 `index`, extensions 的值为 `[".js", ".json", ".node"]`, 因此 node 中会[依次解析](https://github.com/nodejs/node/blob/master/lib/internal/modules/esm/resolve.js#L307) `a/index.js`, `a/index.json`, `a/index.node`, 最终返回 `<your_path>/a/index.js`.

## 约束入口文件的字段 `exports`

`exports` 字段用于约束**库**的入口文件（`main` 字段可以用于相对路径的文件夹，也可以用于 `node_modules` 下的库），它的优先级高于 `main`, 且功能更加丰富。

例如库 `b` 的文件目录如下：

```
|- node_modules
|--- b
|---- lib
|------ lib2
|-------- main.js
|------ browser.js
|------ index.js
|---- main.js
|---- x.js
|-- package.json
```

`exports` 字段可以是多种类型：

- 当 `exports` 为 `string` 时，表示库的入口文件，例如 `exports: './x.js'`, `require('b')` 会加载 `<your_path>/node_modules/b/x.js`. 另外，它也表示该库内只可以从入口文件文件引入，此时，执行 `require('b/main.js')` 会抛出不满足 `"exports"` 的报错（甚至执行 `require('b/x.js')` 也会报错）， 但如果通过相对路径引入，即执行 `require('./node_modules/b/main.js')`, 则会绕过 `exports` 的限制，并加载 `<your_path>/node_modules/b/main.js`.
- 当 `exports` 为 `string[]` 时，会解析第一个值，例如 `export: ["./x.js", "./y.js"]`, `require('b')` 会加载 `<your_path>/node_modules/b/x.js`; 若第一个值指向的路径不存在，则会报错，例如 `export: ["./y.js", "./x.js"]`, `require('b')` 会抛出找不到模块的报错。 
- 当 `exports` 为对象时，表示多个入口文件，例如：
  
  ```json
  {
    "exports": {
      ".": "./x.js",
      "./main": "./main.js",
      "./lib-two/*": "./lib/lib2/*.js"
    }
  }
  ```

  此时：
  - `require("b")` 会加载 `<your_path>/node_modules/b/x.js`;
  - `require("b/main")` 会加载 `<your_path>/node_modules/b/main.js`; 但是注意，`require("b/")` 会抛错，因为在 `exports` 中并没有定义 `"./"` 指向何处；
  - `require('b/lib-two/main')` 会加载 `<your_path>/node_modules/b/lib/lib2/main.js`, 但是 `require('b/lib-two/main.js')` 会抛出找不到 `main.js.js` 模块。

  另外，可以在 `exports` 使用条件导入导出，例如：
  
  ```json
  {
    "exports": {
      ".": {
        "import": "./main.js",
        "browser": "./lib/main.js",
        "default": "./x.js",
      },
      "./lib-two/*": "./lib/lib2/*.js"
    }
  }
  ```

  此时：
  - 执行 `import("b")` 会命中到 `import` conditional, 因此会加载 `<your_path>/node_modules/b/main.js`;
  - 执行 `require("b")` 则会命中 `default`, 因此加载 `<your_path>/node_modules/b/main.js`;
  - 也可以通过 `node --conditions=browser` 来指定 conditional, 这种情况下执行 `require("b")` 会加载 `<your_path>/node_modules/b/lib/main.js`.

此外，`exports` 字段有一些额外的注意项：

- 字符串值需要以 `"./"` 开头；
- 若对象内存在 `default` 的 conditional, 则 `default` 需要放到对象的最后一个；
- 引入某个库时只能引入 `exports` 约定的字段（相对路径的引入方式不受约束）；
- 不能通过 subpath pattern 来引入库*外*的文件，例如在上例中执行 `require('b/lib-two/../../../../../../../../x')` 会抛出 `exports` 字段未定义该 `target` 的错误。

## 约束引入模块的字段 `imports`

`imports` 字段用来约定**当前项目内**引入其他库时的映射情况。

例如，项目 c 的文件目录如下：

```
|- node_modules
|--- c
|----- index.js
|- dir
|--- b.js
|- a.js
|- package.json
```

假设 package.json 内的 `imports` 字段如下：

```json
{
  "imports": {
    "#dir": "./dir/b.js",
    "#ccc/": "c/",
    "#c": "c",
  }
}
```

此时：

- `require('#dir')` 会加载 `<your_path>/dir/b.js`;
- `require('#c')` 会加载 `<your_path>/node_modules/c/index.js`;
- `require('#ccc/')` 会报错，因为 `imports` 内该字段并不是一个 subpath pattern, 需要执行 `require('#ccc/index.js')` 来加载 `<your_path>/node_modules/c/index.js`;

此外，`imports` 字段有一些额外的注意项：

- `imports` 的类型为 `Object`.
- 字符串值需要以 `#` 开头。
- `imports` 字段仅约束了其内部定义的映射，项目内依然可以正确的引入文件，例如 `require('./a')` 是可以正常运行的，它会加载 `<your_path>/a.js`.
- `imports` 同样支持 conditional names.

## 别名 `browser`

** `browser` 字段并不是 node 原生支持的，此处描述的是 `enhance_resolve` 内默认情况下对 `browser` 字段的处理。**

`browser` 字段用来定义别名，即当引入 `a` 时，实际上引入了 `b`.

假设项目 `d` 的文件结构如下：

```
|- node_modules
|--- module-a
|--- module-b
|--- module-c
|- browser
|--- module-a.js
|- lib
|--- ignore.js
|--- replaced.js
|--- browser.js
|- package.json
```

当 `package.json` 下的 `browser` 字段如下时：

```json
"browser": {
  "./lib/ignore.js": false,
  "./lib/replaced.js": "./lib/browser",
  "module-a": "./browser/module-a.js",
  "module-b": "module-c",
  "module-d": "module-b",
  "./toString": "./lib/toString.js",
  ".": false
}
```

此时：（下面 `resolve` 可以看作 `resolve = require('enhance_resolve').crate.sync()`)

- `resolve(<yours_path>, 'module-a')` 会解析成 `<your_path>/node_modules/module-a/browser.js`;
- `resolve(<yours_path>, 'module-b')` 会解析成 `<your_path>/module-c`;
- `resolve(<yours_path>, 'module-d')` 会解析成 `<your_path>/module-b`;
- `resolve(<yours_path>, '.')` 会解析成 `false`, 表示该文件不应该被处理；
- `resolve(<yours_path>, './lib/ignore.js')` 会解析成 `false`;
- `resolve(<yours_path>, './lib/replaced')` 会解析成 `<your_path>/lib/browser.js`;
- 需要注意的是，`browser` 只关注最终的结果是否匹配，例如 `resolve(<yours_path>/lib, './replaced')` 依然会解析成 `<your_path>/lib/browser.js`;


需要注意：`browser` 与 `alias` 并不相同：

- `alias` 会检查引入路径是否与自定义的键值匹配，例如自定义 alias 为 `{"@/": "./src"}`, 则遇到 `require("@/a")` 时会转化为执行 `require("./src/a")`, 更多细节可以参考 [webpack resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias); 
- `browser` 是用于替换整个匹配好的路径，例如在上例的情况下的路径解析结果为 `lib/ignore.js`, 则需要映射为 `false`, 它在 enhanced-resolve 的配置参数为 [alias-fields](https://webpack.js.org/configuration/resolve/#resolvealiasfields)