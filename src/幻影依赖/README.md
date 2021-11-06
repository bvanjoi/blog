# 幻影依赖(Phantom Dependencies)

前端工程中会引入各式各样的依赖，这些依赖自身实现中又有很多依赖。例如，模块 A 依赖了模块 B 和模块 C, 模块 C 又依赖了模块 D, 它们便组成如下有向无环图：

![依赖示例](https://img-blog.csdnimg.cn/f8829a0b0cde46c88c5722ac43d79ad5.png)

在 Node 中，如果引入了模块 A, 则模块 B, C, D 被下载到项目内的 `node_modules` 中，例如，在空目录下仅仅执行 `npm install minimatch@3.0.4 --save && npm install rimraf --save-dev`, 其目录结构为：

![目录结构](https://img-blog.csdnimg.cn/584f754023db4e12bf638aacd8bbe57a.png)

此时出现了问题，我们仅仅安装了两个库 `minimatch` 和 `rimraf`, 但是为什么模块如此之多？

原因很简单，其余的模块来自于 `minimatch` 和 `rimraf` 下 `dependencies`, 其结构可以通过 `npm list` 观察：

![依赖图](https://img-blog.csdnimg.cn/59278372ee1b44449b51dcfa4d507f6c.png)

此时，依据传统的 Node 模块解析下，会导致一个问题：可以直接引入 `dependencies` 内不存在的依赖模块。例如，在上述例子中，项目根目录下仅有 `minimatch` 和 `rimraf`, 但在实际开发中，可以直接引入 `balanced-match` 和 `wrappy` 模块而不报错：

```js
const pkgNotExistsInDep1 = require('balanced-match')
const pkgNotExistsInDep2 = require('wrappy')
console.log(pkgNotExistsInDep1)
// [Function: balanced] { range: [Function: range] }
console.log(pkgNotExistsInDep2)
// [Function: wrappy]
```

上述 `balanced-match` 和 `wrappy` 即位幻影依赖。

## 幻影依赖导致的问题

1. 版本问题。虽然我们指定了 `minimatch` 的版本为 `3.0.4`, 但是 `brace-expansion` 中仅仅只要求 `balanced-match` 的版本为 `^1.0.0`, 依照版本语义化规则，`balanced-match` 的版本是不固定的。
2. 依赖不存在问题。`wrappy` 来自于 `rimraf`, 但是 `rimraf` 被通过 `--save-dev` 将其标记为 `devDependencies`（这表明发包时不会带上 `rimraf`），从而导致 `wrappy` 不存在。

## 解决幻影依赖的方案

- [Rush](https://rushjs.io/): 移除了 mono-repo 下根目录的 `node_modules`, 通过链接来消除幻影依赖。
