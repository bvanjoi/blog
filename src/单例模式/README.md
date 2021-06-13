# 单例模式

所谓单例模式，是指一个类只有一个实例，并且提供访问它的全局方法。

```js
class Single {
  #count = 0;
  
  constructor() {
    if (Single.flag !== 1 && new.target) {
      // 确保 instance 的示例只能从 static getInstance 获取
      // 当然了，这样的方法还是不太靠谱
      throw new Error()
    }
  } 
 
  get() {
    return this.#count;
  }
 
  add() {
    this.#count += 1;
  }
  
  static getInstance() {
    Single.flag = 1;
    if (!Single.instance) {
      Single.instance = new Single();
    }
    Single.flag = 0;
    return Single.instance;
  }
}

const s1 = Single.getInstance();
const s2 = Single.getInstance();
const s3 = Single.getInstance();
const s4 = Single.getInstance();

console.log(s1 === s2) // true
console.log(s1 === s3) // true
console.log(s1 === s4) // true

//  const s5 = new Single(); // Error
```
