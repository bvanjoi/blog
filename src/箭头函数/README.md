# 箭头函数

ES6 中引入箭头函数来声明函数。

```javascript
const f = (n) => {
  return n * n;
}
```

等价于：

```javascript
var f = function (n) {
    return n * n;
};
```

## 语法上

箭头函数中，有一些语法需要注意：

参数：

- 如果没有参数，则传入一个空的圆括号：`var f = () => { return 2; }`.
- 如果只有一个参数，则圆括号可以省略：`var f = n => { return n; }`.
- 如果函数只有一条语句，且该语句为返回值，则可省去大括号与 `return`, 例如：`var f = n => n`.

## 更多特性

### 捕捉上下文的 this

箭头函数的 `this` 是固定的

在 `function` 写法中，`this` 的指向与函数的调用方式有关：1. 直接调用，指向 window（非严格模式），undefined（严格模式）；2. 对象内调用，指向对象；3. 构造函数调用，`new` 返回一个对象；4. call, bind 中，指向绑定的对象；5. setTimeout 和 setInterval 中，默认为指向 window.

```cpp
function T() {
    this.log = function() {
      console.log(this);
    }
  }
  
(new T()).log(); // T {log: [Function]}
setTimeout( (new T()).log, 100); // Window
```

如果我们将函数 `this.log` 改成箭头函数，则不会出现这个问题，这是因为箭头函数中 `this` 始终指向函数定义时的对象。

```javascript
function T() {
  this.log = () => {
    console.log(this);
  }
}
  
(new T()).log(); // T {log: [Function]}
setTimeout( (new T()).log, 100); // T {log: [Function]}
```

### 不能当作构造函数

例如，对于箭头函数 `var f = n => n`, 不能使用 `new f()` 这样的语法。

可以结合箭头函数中 `this` 来考虑。

### 不能包含 argument 参数

可以使用 rest parameter 来代替, 例如：

```javascript
var f = (...rest) => {
  console.log(rest)
}

f(1,2,3,4,5); // [ 1, 2, 3, 4, 5 ]
```

### 不能使用 `yield` 命令，因此不能作为 Generator 函数
