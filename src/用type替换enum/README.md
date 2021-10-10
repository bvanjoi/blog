# 用 type 替换 enum

本篇文章主要用来介绍 TypeScript 中：

1. `enum` 用法与应用；
2. 用 `type` 替代 `enum` 及原因；
3. 什么时候建议用 `enum`.

## enum

### enum 介绍

在 TypeScript 中，提供了名为枚举的关键字 `enum`, 它用来定义一些常量，例如：

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

但是，由于 JavaScript 中并没有关键字 `enum`, 所以，ts 会为每个没有初始化的值自动赋值，例如，上述代码中，`Direction.Up` 的值为 `0`,`Direction.Down` 的值为 `1`,`Direction.Left` 的值为 `2`,`Direction.Right` 的值为 `3`.

当 ts 转换成 js 后，实际存储为：

```js
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

这看起来很复杂，实际分析一下：

1. 第一行声明变量 `Direction`.
2. 第二行是一个立即执行函数，传入的参数为 `Direction || (Direction = {})`, 该参数保证了 `Direction` 存在，且**通常**情况下为一个对象。
3. 函数内部，只看函数的第一行：`Direction[Direction["Up"] = 0] = "Up";`, 这行代码实现了两个功能：1. 将 `Direction.Up`赋值为 `0`, 返回数字 `0`; 2. 随后将 `Direction[0]` 赋值为 `UP`.

即，执行完上述代码后，其结果为如下：

```javascript
{
  '0': 'Up',
  '1': 'Down',
  '2': 'Left',
  '3': 'Right',
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3
}
```

若给予枚举变量初始值，例如：

```typescript
enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}
```

最终生成的 js 代码如下，可见，js 最终生成了一个对象，该对象的 `key` 和 `value` 为初始值。

```js
var Direction;
(function (Direction) {
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction || (Direction = {}));
```

### enum 的应用

在很多项目中，通常会使用 enum 来改善代码可读性。

例如，一个网络请求的返回值可能存在 Success 和 Failed 的两种状态，则可以写成：

```ts
enum Status {
  Success = 'Success',
  Failed = 'Failed'
};

// resp 是结果
if (resp === Status.Success) {
  // 返回成功时的处理
} else if (resp === Status.Failed) {
  // 返回失败时的处理
}
```

### 建议

上述代码看起来还可以，但可是，我并不建议这么做。

我认为应该使用 `type` 关键词，例如：

```ts
/** 声明 Status 类型，其值为 'Success' 或 'Failed'*/
type Status = 'Success' | 'Failed'

// resp 是结果, 其类型为 Status
if (resp === 'Success') {
  // 返回成功时的处理
} else if (resp === 'Failed') {
  // 返回失败时的处理
}
```

## 多用 type, 少用 enum

`enum` 存在以下问题：

1. `enum` 只是 js 语法糖而已, 正如示例所示，在 ts 中声明 `Direction` 会被编译成 js 中的对象，这种行为会增加冗余的代码量，并进一步包的体积（并且无法被 tree shaking 掉）。当然，可以使用 `const enum` 来解决上述问题（也只有在 rollup 中 `const enum` 会被 tree shaking），例如：

    ```ts
    // ts 中
    const enum Direction {
      Up = 'Up',
      Down = 'Down',
      Left = 'Left',
      Right = 'Right'
    } 

    const direction = Direction.Up;
    ```

    经过编译后，生成的 js 代码为：

    ```ts
    var A = "Up" /* Up */;
    ```

2. 若未定义初始值，则使用 `enum` 会默认设定为 `number` 类型的 0,1,2... 而这样做，可能导致潜在的数据问题：

    - case 1: 传入无效的值，但是在静态检查阶段并不会报错。

    ```ts
    enum Direction {
      Up,
      Down,
      Left,
      Right,
    }
    declare function move(d: Direction): void;

    move(Direction.Left); // Ok
    move(0); // Equal Direction.Up
    move(30); // 编译器不会报错，但是相当于传入无效值
    ```

    - case 2: 错误的使用其类型，例如，html 的 data-\* 中可以存储自定义数据，如果我们将 `Direction.Up` 存入其中，就意味着将 `number` 类型存入其中，但是，再当我们取出时，其类型为 `string`, 这是因为 html 标签的 data-* 进行了隐式类型转换，进而导致潜在的问题：

    ```ts
    enum Direction {
      Up,
      Down,
      Left,
      Right,
    }

    const App = () => {
      const divRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        console.log(typeof divRef.current.getAttribute('data-id'));
        // string
      }, []);

      return <div data-id={Direction.Up} ref={divRef} />;
    };
    ```
  
3. 对于具有初始值的 `enum`, 当使用其初始值时，尽管二者是完全相等的值，但是依旧会出现类型不兼容的问题：

    ```ts
    enum Direction {
      Up = 'UP',
      Down = 'DOWN',
      Left = 'LEFT',
      Right = 'RIGHT',
    } 

    declare function move(d: Direction): void;
    
    move(Direction.Left); // Ok
    
    move('UP');
    // ERROR: Argument of type '"UP"' is not assignable to parameter of type 'Direction'.
    ```

针对上述问题，我们都可以使用 `type` 进行规避：

1. 对于问题1, 由于 `type` 属于 ts 语法，当其转化为 `js` 时，`type` 类型会被消去：

    ```ts
    type Direction = 
      'UP' | 
      'DOWN' |
      'LEFT' |
      'RIGHT';

    // 将 d 的类型写为 Direction, 进而保证类型推导
    const d:Direction = 'UP'; 
    ```

    转化为 js 后，代码为：

    ```js
    var d = 'UP';
    ```

2. 针对问题 2, 而对于指定类型的参数，若不满足其要求，则会在静态检查阶段报错：

    ```ts
    type Direction = 
      'UP' | 
      'DOWN' |
      'LEFT' |
      'RIGHT';

    declare function move(d: Direction): void;

    move('TOP'); 
    // ERROR: Argument of type '"TOP"' is not assignable to parameter of type 'Direction'.
    ```

3. 针对问题 3, `type` 的功能是别名，并未生成新的值，因此使用 `type` 可以解决该问题。

## 总结

综上，`enum` 带来的一些问题可以用 `type` 规避掉许多问题。

我个人建议：

1. 对于一些用数字 0,1,2,3 表示的状态，可以使用 `enum` 来使代码语义化。
2. 其余情况，诸如字符串常量等等，使用 `type`.
