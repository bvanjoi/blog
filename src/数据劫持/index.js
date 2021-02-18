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