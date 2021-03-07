# 观察者模式

现实世界中，物体并不是单独存在的。一个对象的行为可能会导致其他多个对象发生变化。

观察者模式(Observer)即指：多个对象之间存在**一对多**的依赖关系，当一个对象的状态发生变化时，所有与之相关的对象属性也发生更新。

观察者模式又被称呼为监听模式等。

## 示例与代码

假设两个股民小红与小明，他们同时购买了一只基金，但是由于他们二人对于预期收益要求不同，当股票跌到某种状态时，二人的反应也会不同。

上述事例便可以抽象为观察者模式。

- 被观察者：即股票的跌涨。
- 观察者：小明与小红。二人的反应可以对应其属性的变化。

### 首先，我们来定义两个对象

1. 表示股票的类：

    ```javascript
    /** 股票  */
    class Stock {
      /** 购买该股票的用户 */
      holders = [];
      /** 该股票相较于昨天的收益 */
      earnings = 0;
      
      /**
       * 更新
      * @param {number} price 
      */
      update(price){
        // 更新今天的收益
        this.earnings = price;
        // 随后，告诉股民
        this.notify();    
      }

      /**
       * 为股民发通知告知收益
      */
      notify() {
        this.holders.forEach((holder) => {
          holder.reaction(this.earnings);
        })
      }
    }
    ```

2. 表示股民的类：

    ```javascript
    /**
     * 股民的类
    */
    class Person {
      /**
       * 
      * @param {string} name - 姓名
      * @param {Function} reaction - 看到收益后的反应
      */
      constructor(name, reaction) {
        this.name = name;
        this.reaction
      }

      /** 购买股票的行为 */
      buyStock(stock) {
        stock.holders.push(this.name)
      }
    }
    ```

### 之后，生成实例

```javascript
/** 某支垃圾股 */
const garbageStock = new Stock();

/** 坚决不当韭菜的小红 */
const hong = new Person('XiaoHong', (earnings) => {
  if (earnings < -0.1) {
    console.log('XiaoHong: 不抛就不会输');
  }
})

/** 永远在后悔的小明 */
const ming = new Person('XiaoMing', (earnings) => {
  if (earnings < -0.1) {
    console.log('XiaoMing: 怎么亏这么多，为什么我昨天不下车');
  }
})
```

### 再之后，他们买了这个垃圾股

```javascript
hong.buyStock(garbageStock);
ming.buyStock(garbageStock);
```

### 第二天，这个垃圾股跌了 20%

```javascript
garbageStock.update(-0.2);
```

随后，在 `Stock` 的 `notify` 中，通知到了两个持有股票的人，二人的反应也如下所示：

```txt
XiaoHong: 不抛就不会输
XiaoMing: 怎么亏这么多，为什么我昨天不下车
```
