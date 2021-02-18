# 数据劫持

数据劫持又名数据代理，它是指访问或修改某个对象的属性时，通过拦截该行为，后进行额外的操作，再返回结果。

在 JavaScript 中，可以使用 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 和 [`Proxy`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 来实现该效果。

示例：

```javascript
const obj = {};

let value = '';

// 为 obj 对象添加名为 msg 的属性
Object.defineProperty(obj, 'msg', {
  set: (v) => {
    console.log('trigger set');
    value = v;    
  },
  get: () => {
    console.log('trigger get');
    return value;
  }
})

console.log('begin', obj);
obj.msg = 'test';
console.log('after set obj.msg', obj);
console.log(obj.msg)
```
