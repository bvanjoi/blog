# 观察者模式

现实世界中，物体并不是单独存在的。一个对象的行为可能会导致其他多个对象发生变化，例如股票对个人财富的影响。

观察者模式(Observer)即指：多个对象之间存在**一对多**的依赖关系，当一个对象的状态发生变化时，所有与之相关的对象属性也发生更新。

```js
/** 事件处理 */
class Event {
  /** 订阅者们 */
  subs = [];
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    })  
  }
}

const e = new Event();

function eventTrigger() {
  console.log('trigger event');
  e.notify();
}

/** 订阅该事件的事物 */
const sub1 = {
  name: 'sub1',
  update() {
    console.log(this.name + ' had update');
  }
}
e.addSub(sub1);

const sub2 = {
  name: 'sub2',
  update() {
    console.log(this.name + ' had update');
  }
}
e.addSub(sub2);

eventTrigger();
// rigger event
// sub1 had update
// sub2 had update
```
