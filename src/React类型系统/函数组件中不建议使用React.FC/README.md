# 函数组件中不建议使用 React.FC

React 中有两种方式创建组件：

- 创建一个继承自 `React.Component` 的 `class`.
- 创建一个返回 `JSX.Element` 的 `function`.

本文中，我们讨论**函数组件**。

首先，我们来看函数组件的基本类型：`(props?: any) => JSX.Element`, 它有一个可选参数，并返回 `JSX` 语法。

例如：

```javascript
/** 函数组件的 props 类型 */
type Props = {
  message: string;
}

/** 自动类型推导的函数组件 App，其类型为 () => JSX.Element */
const App = () => <div>Hello world</div>;

/** 将 Bpp 声明返回类型为 JSX.Element, 若返回值不为 JSX, 则会报错 */
const Bpp = ({message}: Props):JSX.Element => <div>{message}</div>;

/** 声明组件 Cpp 类型为 React.FC */
const Cpp: React.FC<Props> = ({message}) => <div>{message}</div>;
```

## 不建议使用 React.FC

### React.FC 是什么

`React.FC` 是 `React.FunctionComponent` 的简写，而 `React.FunctionComponent` 的定义为：

```ts
interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P>;
  contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}
```

> 可见：源码地址：<https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L539>

### 问题1: 无用的 children

对于 JSX 而言，例如 `<div><span/></div>` 意味着 `div` 标签带有 children: `<span/>`.

在 `React.FC` 中，`props` 的类型 `PropsWithChildren<P>` 为 `type PropsWithChildren<P> = P & { children?: ReactNode };`.

这意味着 `React.FC` 可能存在以下问题：

```tsx
const A: React.FC = () => <div>innerA</div>;

const App = () => (
  <A>
    <div>Child of A</div>
  </A>
);
```

很明显，`<div>Child of A</div>` 并没有用上，但是由于 `props` 的类型，导致在静态类型检查阶段没有发现这段代码无用，从而没有报错。

而若改为：

```tsx
const A = () => <div>innerA</div>;

const App = () => (
  <A>
    <div>Child of A</div>
  </A>
);
```

则会在类型上报错：由于组件 `A` 的 `props` 并不包含 `children`, 而外层使用 `A` 时又用到 `children`, 进而导致报错。进而帮助开发者减少无用的代码。

![error in A props](https://img-blog.csdnimg.cn/202103222143064.png)

针对该问题，可以使用 `React.VFC` 来代替 `React.FC`.

### 问题2: 当存在 defaultProps 时，静态类型检查出错

在函数组件中，可能要使用 `defaultProps` 来设定默认的 `props`, 而若使用 `React.FC`, 则可能发生一些冲突。

首先来看不使用 `React.FC` 的情况：

```tsx
type Props = {
  name: string;
};

const A = ({ name }: Props) => <div>{name.toUpperCase()}</div>;

A.defaultProps = {
  name: 'hello world',
};

const App = (): JSX.Element => <A />;
```

此时，一切正常，不会有任何问题。

而若将 `A` 的类型设置为 `React.FC`, 即：

```tsx
type Props = {
  name: string;
};

const A: React.FC<Props> = ({ name }) => <div>{name.toUpperCase()}</div>;

A.defaultProps = {
  name: 'hello world',
};

const App = (): JSX.Element => <A />;
```

问题就出现了，它是因为 `<A />` 中没有传入 `name` 参数：

![error because lack name](https://img-blog.csdnimg.cn/20210322215653927.png)

## 总结

我们所言的静态类型，其实只存在于 TypeScript 的类型检查阶段，而对于 ts 生成的 js 代码，并不会引起运行时错误。因此，抛去这些细微的差别，完全可以将函数组件标注为 `React.FC`.

## 参考

1. [create-react-app 的 ts 模版中移除 React.FC 的 PR](https://github.com/facebook/create-react-app/pull/8177)
