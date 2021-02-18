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

eventTrigger()