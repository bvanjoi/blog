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
    this.reaction = reaction;
  }

  /** 购买股票的行为 */
  buyStock(stock) {
    stock.holders.push(this)
  }
}

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

hong.buyStock(garbageStock);
ming.buyStock(garbageStock);

garbageStock.update(-0.2);
// XiaoHong: 不抛就不会输
// XiaoMing: 怎么亏这么多，为什么我昨天不下车

