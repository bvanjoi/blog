# TypeScript 中的 `interface` 和 `type`

TypeScript 作为 JavaScript 的超集，它为 JavaScript 提供了一套完善的静态类型系统。

其中，就有两个关键字：`interface` 和 `type`, 很多初学者会困惑于二者的差异。

## `type` aliases

`type` 指的是**别名**, 例如：

```typescript
/** Point 等价于 {x: number, y: number} 类型 */
type Point = {
  x: number;
  y: number;
}
/** Point3D 扩展自 Point 与 {z:number} */
type Point3D = Point & {z: number};
/** Num 等价于 number */
type Num = number;
/** ID 等价于 number | string 类型 */
type ID = number | string;
/** getID 等价于 () => number | string 类型*/
type getID = () => number | string;
```

可见，`type` 的本质是给一种类型（基本类型或复合类型）起一个新的名字。

## `interface`

`interface` 定义了一个**对象类型**，例如：

```typescript
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}
```

## `interface` 与 `type` 的异同

从上述示例中可以看出， `interface` 实现的功能**通常**用 `type` 也可以实现。

但是，关键性的区别在于：`type` 不可以*声明合并*，而 `interface` 可以。

例如，当使用 `interface` 来定义 `A` 的类型时:

```typescript
interface A {
  hello: string;
}
interface A {
  world: string;
}

const a:A = {
  hello: 'hello',
  world: 'world'
}
// It's right
```

如果使用 `type`, 则会报错：

```typescript
type B = {
  hello: string;
}
type B = {
  world: string;
}
// Error: Duplicate identifier 'B'.
```

## 结论

对于绝大多数情况，可以依据个人喜好来进行选择。

但是，这里有几个建议：

- 对于 API 的类型，使用 `interface`.
- 对于 React 中的 Props, 使用 `type`.
