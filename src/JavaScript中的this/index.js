function consoleThis() {
  console.log(this);
}

function consoleThis2() {
  'use strict'
  console.log(this);
}

// 非严格模式下直接执行，指向全局
consoleThis()
// 严格模式下直接执行，指向 undefined
consoleThis2()

// 指向上下文的 this
const p = {
  name: 'mike',
  consoleThis,
  brother: {
    name: 'lucas',
    consoleThis
  }
}
p.consoleThis() // {name: 'mike', consoleThis: Function, brother: Object}
p.brother.consoleThis() // {name: 'lucas', consoleThis: Function}

// call/apply/bind 强制改变 this 指向
consoleThis2.call(p.brother.name) // lucas

// new 

function person() {
  this.name = 'jack'
}
console.log((new person()).name)

// new 的特殊情况
// 1. 返回函数内部生成的对象

function person2() {
  this.name = 'penny';
  const obj = {};
  return obj;
}
console.log(new person2()) // {}, 表明返回 obj.
// 2. 返回的是非对象的值
function person3() {
  this.name = 'tom';
  return 1;
}
console.log(new person3()) // {name: 'tom'}, 表明返回目标对象的实例 this



const a = () => {
  console.log(this)
}

const arrowP = {
  name: 'mike',
  consoleThis() {
    return this;
  },
  brother: {
    name: 'lucas',
    consoleThis: () => {
      return this;
    }
  }
}
console.log(arrowP.consoleThis()) // {name: 'mike', consoleThis: Function, brother: Object}, 指向当前对象
console.log(arrowP.brother.consoleThis()) // {}, 等价于 a() 的返回结果
console.log(a()) // {}