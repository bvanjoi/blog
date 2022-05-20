# Define 的设计与实现

前端工程中，在某些情况下经常会需要把代码内某些变量替换为指定的值，例如，用于判断不同的运行环境：

```js
if (IS_PRODUCTION) {
  require('xx.production.js');
} else {
  require('xx.development.js');
}
```

此时，可以在编译阶段对 `IS_PRODUCTION` 进行替换，诸如线上环境将其置换为 `true`, 开发环境置换为 `false`, 以满足不同环境的不同需求。

## 最简单的实现思路

第一眼看去，最简单的方法是使用 `code.replaceAll(original, target)` 这种全局替换的方式，但该方法问题也很明显：它会将不需要替换的变量也替换掉。

[@rollup/plugin-replace](https://github.com/rollup/plugins/blob/master/packages/replace/src/index.js#L69) 践行了该方法，同时它的弊端也正如上述所述，示例如下：

![上中下依次为源文件、配置项、产物](https://img-blog.csdnimg.cn/cbcf335429c34f55ba82b46752b57bca.png)


这里，我认同 `replaceAll` 的方法在绝大部分情况下是可以满足业务需求的，但遗憾的是，该方法很难实现预期的效果，且往下看。

## 明确输入与输出

Define 解决的问题是：用户指定一组映射，打包工具需要将代码内用户指定且满足条件的键映射到指定的值上。其中，满足条件是指：代码中被替换的值需要是 IdentifierExpression, MemberExpression 等节点，且 VariableDeclarationExpression 中的 id 不能被替换。

在上述 `replaceAll` 的实现中，它将 RegExpLiteral 替换成了指定值，因此不满足需求。

再来看一个复杂示例，如果用户定义：

```js
config = {
  define: {
    OBJ = {
      I1: {
        I2: {
          ARR: [1, {
            I3: 2           
          }]
        }
      },
    },
  }
}
```

那么对于代码：

```js
OBJ.I1.I2.ARR
OBJ.I1.I2.ARR[0]
OBJ.I1.I2.ARR[1].I3
```

预期的（生产环境下）打包结果是：

```js
[1, {I3: 2}]  // OBJ.I1.I2.ARR
1 // OBJ.I1.I2.ARR[0]
2 // OBJ.I1.I2.ARR[1].I3
```

为实现上述要求，需要在 AST 层面上进行处理。

## 补充一个边界 case

注意，按照要求，如果对变量进行了声明，则该变量不应该被替换，即：

```js
let OBJ;
console.log(OBJ);
```

打包结果为：

```js
console.log(undefined);
// 而不是 {I1: {I2: {ARR: [1, {I3: 2}]}}}
```

为此，需要考虑到 `var` 的变量提升特性：

```j
console.log(OBJ);
var OBJ
```

打包结果为：

```js
console.log(undefined);
// 而不是 {I1: {I2: {ARR: [1, {I3: 2}]}}}
```

## 思路

基于上述要求，实现 Define 的方案步骤如下：

1. 对代码进行解析，输出 AST.
2. 第一次遍历 AST, 拿到 VariableDeclarationExpression 中的 Identifier, 将其存放到 `can_not_renamed` 的集合中。
3. 将用户输入的 Define 转换成一颗前缀树，其目的是更便捷的匹配映射。
4. 第二次遍历 AST, 对于 IdentifierExpression, MemberExpression 进行转换。

## 细节

针对 1, 2 两点，一般使用 Babel, SWC 解析后遍历一遍即可，不再赘述。

下面着重来看第 3 点中的前缀树。

首先，为什么要构造一颗 tire? 考虑诸如 `a.b.c` 这种 MemberExpression 的节点，它生成的 AST 为：

```json
{
  "type": "MemberExpression",
  "object": {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "a"
    },
    "property": {
      "type": "Identifier",
      "name": "b"
    }
  },
  "property": {
    "type": "Identifier",
    "name": "c"
  }
}
```

如果通过字符串匹配来考察是否替换，那么会出现性能问题：对于每个节点都进行了遍历（线性时间），之后再检查该字符串是否出现在 Define 的键中（对数时间）；相反，如果通过对 Define 构造前缀树处理，那么最优时间复杂度为 `O(1)`, 此时若第一个节点不匹配，则直接返回。

另外，tire 的方式也更适合实现将 `OBJ.I1.I2.ARR[0]` 直接转换为 `1` 的处理。

下面，来看一组前缀树的示例，例如，用户输入的 Define 为：

```js
{
  process: "ONLY_TAG",
  env: "ONLY_TAG_2"
  "process.env.NODE_ENV": "dev"
  OBJ: {
    A: [1,2],
    B: {
      C: 3
    }
  }
}
```

那么，它生成的前缀树为：

```json
{
  "process": {
    "value": "ONLY_TAG",
    "children": {
      "env": {
        "value": null,
        "children": {
          "NODE_ENV": {
            "value": "dev",
            "children": null
          }
        }
      }
    }
  },
  "env": {
    "value": "ONLY_TAG_2",
    "children": null
  },
  "OBJ": {
    "value": "{A: [1,2], B: {C: 3}}",
    "children": {
      "A": {
        "value": "[1,2]",
        "children": {
          "0": {
            "value": 1,
            "children": null
          },
          "1": {
            "value": 2,
            "children": null
          }
        }
      },
      "B": {
        "value": "{C: 3}",
        "children": {
          "C": {
            "value": "3",
            "children": null
          }
        }
      }
    }
  }
}
```

之后，再来看步骤 4 中的遍历 AST 并转换的操作：

假设代码为：

```js
env
```

上述代码在 AST 中的类型为 IdentifierExpression, 通过 Babel 或者 SWC 的 visit 操作，可以对其遍历到该节点，将其放到前缀树中匹配，可以将其转化为 `ONLY_TAG_2`.

假设代码为：

```js
process.env.NODE_ENV
```

上述代码在 AST 中的类型为 MemberExpression, 在 visitor 中的遍历到该节点，随后，对 MemberExpression 中的 `property` 和 `obj` 进行逐个检查，发现它可以最终可以匹配到 `dev`.

> 注意，此处的匹配算法有些繁琐，原因在于：AST 中的节点与之前构建的前缀树节点方向相反：前缀树中可以通过 process 节点拿到 env, 再拿到 NODE_ENV; 而 AST 中需要通过 (member.obj).obj 能拿到 process, (member.obj).property 能拿到 env, member.property 能拿到 NODE_ENV.


假设代码为：

```js
process.env
```

匹配到 `env` 时发现其 `value` 为 null, 因此不予处理。

假设代码为：

```js
OBJ
```

可以直接匹配到 `{A: [1,2], B: {C: 3}}`, 直接替换为 `({A: [1,2], B: {C: 3}})` 即可。


假设代码为：

```js
OBJ.C
```

它的最深层次的匹配也只是到 `OBJ` 处，因此替换成 `({A: [1,2], B: {C: 3}}).C`.

最后看：

```js
OBJ.A[0]
```

它可以逐级匹配到 `1`.

## 妥协

以上就是理想状态的替换方案，但是在实际实现中我做出了一些妥协：Define 的前缀树中并没有对 Object 和 Array 做展开，也就是说，如果用户输入：

```js
config = {
  define: {
    A: [1,2],
    OBJ: {
      B: {
        C: 3
      },
      D: 4
    },
  }
}
```

实际上生成的 tire 为：

```json
{
  "A": {
    "value": "[1,2]",
    "children": null
  },
  "OBJ": {
    "value": "{B: {C: 3}, D: 4}",
    "children": null,
  }
}
```

则对于代码：

```js
A[1]
OBJ.B.C
```

实际的替换后结果为：

```js
[1,2][1] // A[1]
({B: {C: 3}, D: 4}).B.C // OBJ.B.C
```

上述妥协的原因有二：

1. 完全展开存在一定的性能损失；
2. 常量替换可以放到 `minify` 阶段。