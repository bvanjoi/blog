# 函数式组件中渲染两次的问题

最近写代码时遇到一个有意思的 bug, 写篇博客用于记录。

## 先说场景

首先，考虑类似于这样的一个数据结构：

```ts
interface A {
 /** key 存储了当前实例的键，它是唯一的 */
 key: string;
 /** 存储当前实例中的数据 */
 data: Object;
}
```

另外，类型 `A` 还有一个特性：它的 `key` 值可以自动处理，以防止出现重复，例如

```js
const a = new A('a');  
// 此时，a.key 的值为 'a'
const a1 = new A('a'); 
// A 内部处理后，a1.key 的值为 'a1'
```

再者，可以通过 `key` 来获取实例的 `data`:

```js
const data = getState('a');
```

OK, 以上就是背景。

## 再说问题

使用上述结构时，由于*React函数式组件在开发模式下会渲染两次*，由此产生了问题。

我的代码示例为：

```jsx
const App = () => {
 // new A() 实际上是执行了两次
 const f = new A('f');
 // 在这里，data 出现错误
 // 期待是拿到键值为 'f' 的数据的 data
 // 而由于函数式组件执行了两次，此时是拿到键值为 'f1' 的 data
 const data = getState(f.key)
 return <div>sample</div>
}
// 上述代码暴露了我很菜的事实。。
```

## 函数式组件会渲染两次的示例

来看下面代码：

```jsx
let count = 0

function App() {
  const [state,setState] = useState(1)
  count++;
  console.log(`I have run ${count} time(s)!`)
  return (
    <div>
      <button onClick={() => setState(e => e+1)}>{state}</button>
    </div>
  );
}
```

在 dev 模式下效果为如下图，可见其 count 的值与点击次数*不一致*。

![函数式组件在 dev 模式下多次渲染](https://img-blog.csdnimg.cn/a056243913544190a86ad696835be758.gif)

同样，可以将其放到生产环境，其效果为如下图，可见 count 的值与点击次数*一致*。

![函数式组件在生产环境下只渲染一次](https://img-blog.csdnimg.cn/79d943e3bf8345088065d2a0d244ad2a.gif)

## 为什么会渲染两次

长话短说：**这是 React 刻意为之，函数式组件应当遵从函数式编程风格，每次执行应该是无副作用的(no sideEffect)，在 dev 下多次渲染组件，是为了防止开发者写出有问题的代码。**

在 Github 上，也有相关的 issue, React 的核心开发者之一 Dan 回复如下：

![Dan 的回复](https://img-blog.csdnimg.cn/b0cb79d35e1047cfb851a4bb6dff8449.png)

## 解决方案是什么

1. 把构建实例的时刻写到函数式组件外部：

  ```jsx
  const f = new A('f');
  const data = getState(f.key)
  const App = () => <div>sample</div>
  ```

  但是，上述方法并可取，因为 React 采用数据驱动的思想，如果 `data` 与渲染有关，则还是会存在问题。
2. 利用 `componentDidMount`, 保证该函数只会执行一次，在函数组件中则为 `useEffect(()=>{},[])`.
