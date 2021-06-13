# 用 tree shaking 去除代码

tree shaking: 移除未引用的 JavaScript 代码(dead code).

注意，tree-shaking 有一个前置条件：它依赖 ES6 Module 特性，即 `import` 和 `export`.

> 使用 ES6 Module 的原因：
>
> 1. ES6 Module 只能作为模块顶层的语句出现；
> 2. import 的模块名只能是字符串常量；
> 3. import binding 是 immutable 的。
>
> 上述特性决定了 ES6 Module 可以进行静态分析，这就是 tree shaking 的基础。

例如，文件目录如下：

```txt
|-- index.js
|-- lib.js
|-- webpack.config.js 
```

- `lib.js` 代码为：

```js
export function add(a,b) {
  return a + b;
}

export function sub(a,b) {
  return a - b;
}
```

- `index.js` 代码为：

```js
import {add, sub} from './lib';
console.log(add(1,2))
```

可以注意到，`sub` 这个函数完全没有用到，tree-shaking 的目的就是移除这段无用代码。

## production 模式下

若 webpack.config.js 代码为：

```js
module.exports = {
  return {
    entry: './index.js',
    output: {
      // __dirname 指明项目的目录
      // path.resolve 将参数拼接为路径
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    mode: 'production',
}
```

即当 mode 为 production 时，tree-shaking 是自动开启的，此时打包产物为：

![tree-shaking 效果](https://img-blog.csdnimg.cn/20210608185013778.png)

此时，`sub` 函数已经被 tree-shaking 掉了。

## development 模式下

将 `mode:production` 更改为 `mode:development`, 再执行 `npx webpack` 打包，其结果为：

![引入了 sub 的打包产物](https://img-blog.csdnimg.cn/20210608185756980.png)

可见，此时引入了 `sub` 函数。

-----

## sideEffects

TODO:
