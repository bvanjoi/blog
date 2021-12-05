# 协变、逆变、双变、不变

## 从 TypeScript 的一个示例看起

我们知道，TypeScript 中可以声明函数类型，例如

```ts
type A = () => void;
```

类型 `A` 表示一个函数，该函数不接受任何参数，同时也没有返回值。

我们可以定义函数 `a`, 其类型为 `A`:

```ts
const a: A = () => {
  return 'a';
};
```

同时，TypeScript 也可以为函数声明返回类型：

```ts
const b = (): void => {
  return 'b';
}
```

函数 `b` 的类型为一个函数，该函数没有返回值。

此时，留心观察，可以发现，虽然函数 `a`, `b` 的返回类型均被标记为 `void`, 但实际上都返回一个 `string`.

凭借直觉而言，`typescript` 的静态类型检查中，会给两个函数的返回值**都**标记上错误，但实际上可能有些出入：

![ts 的类型检查报错](https://img-blog.csdnimg.cn/862010db49094aea8fec9b92cfe1d903.png)

观察上图，发现：

- 函数 `b` 的返回值飘红，因为 `string` 类型与 `void` 不兼容，该行为符合预期；
- 然而，函数 `a` 却一切正常，这不符合预期。

本文就来讨论 `b` 飘红但是 `a` 正常的原因。

## 里氏替换规则(Liskov Substitution Principle, LSP)

首先明确子类型的定义：若类型 S 的实例可以使用类型 T, 则 S 为 T 的子类型。

例如：

```ts
// 父类
class Animal {
  name: string;
}
// 子类 Dog
class Dog extends Animal {
  bark(): void {}
}
// 子类 Cat
class Cat extends Animal {
  eat(): void {}
}
```

随后，下面代码可以被 ts 正确处理：

```ts
const d: Animal = new Dog()
const c: Animal = new Cat()
```

即 `Dog` 为 `Animal` 的子类型；`Cat` 为 `Animal` 的子类型。

这就是**里氏替换原则**：所有父类型可以直接使用子类型的实例。

## 概念

协变和逆变讨论具有继承关系的类型，通过类型构造器映射到另外一个范畴时所具有的继承关系。

- 协变(Covariance)：遵循里氏替换原则。
- 逆变(Contravariance)：逆转了子类型序关系；

除此之外，还有不变(invariant)的概念，它是指协变和逆变均不适用的情况；双变，即协变+逆变；

## 协变

下面我们来看协变的示例：

```ts
function dogBark(d: Dog) {
  d.bark();
}
dogBark(new Dog()); // right
dogBark(new Animal()); // error, 由于协变的约束
```

这与里氏替换原则中示例原理一致，均是协变的概念：子类型可以传递给父类型，但是父类型不能传递给子类型。

![协变示例](https://img-blog.csdnimg.cn/58e4ea57150f42cb9d934ad757b8a3dc.png)

## 协变并不安全

协变并不安全，因此此时需要**不变**，例如下列代码：

```ts
let aList: Animal[] = [];
let cList: Cat[] = [];
aList = cList; // 由于协变，可以正确赋值
aList.push(new Dog()); // ts 认为 aList 依旧为 Animal[], 依据协变，Dog 可以被父类型接受
cList.forEach((cat) => {
  // 由于 aList, cList 指向了同一块内存区域
  // cat 的类型可能为 dog.
  cat.eat();
})
```

## 逆变

函数赋值时，可能出现协变的情况：

```ts
let animalEat = (a: Animal) => {
  return a.name;  
}

let dogEat = (d: Dog) => {
  d.bark();
}

dogEat = animalEat; // right, 此处父子类型发生了转化，即逆变
animalEat = dogEat; // error, 因为 `Dog` 比 `Animal` 类型更具体
```

![逆变示例](https://img-blog.csdnimg.cn/dfa4e4f8f0714d16bcc2d411e2f927ae.png?)

## 双变

TypeScript 范型中，函数类型可能出现双变的情况：

```ts
interface Comparer<T> {
  compare(a: T, b: T): void;
}

let animalComparer: Comparer<Animal>;
let dogComparer: Comparer<Dog>;

animalComparer = dogComparer;  // Ok because of bivariance
dogComparer = animalComparer;  // Ok
```

## 回答示例问题

```ts
const b = (): void => {
  return 'b';
}
```

上述代码飘红很好理解，不再解释。

```ts
type A = () => void;
const a: A = () => {
  return 'a';
};
```

下列代码没有飘红，是因为 `() => string` 类型传递给类型 `A` 时发生了逆变。
