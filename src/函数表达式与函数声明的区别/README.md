# 函数声明 vs 函数表达式

JavaScript 中，函数有两种定义方式：

- 函数表达式：

 ```js
 function a() {
  return 1;
 }
 ```

- 函数声明：

 ```js
 const b = function() {return 2;}
 ```

## 二者区别

- 函数声明会预加载；
- 函数表达式不会预加载

``` js
a();

function a() {
 return 1;
}

b(); // ReferenceError: Cannot access 'b' before initialization
const b = function() {return 2;}
```
