# 查询与中断

查询与中断是I/O系统中最常见的信息交互方式。

假设，主机命令某个外设执行工作。

首先，主机要判断外设的状态位，进而知晓外设是否准备就绪。

那么，如何获取外设的状态位呢？

## 查询方式

主机不断像外设发出查询信号，一直检查是否满足条件。

代码示例：

```javascript
let isReady = false;

/** 主机的查询 */
function query() {
  let timer = setInterval(() => {
    if (isReady) {
      clearTimeout(timer);
      return ;
    } 
    isReady = Math.random() > 0.9; // 模拟外设是否就绪
  }, 1000); // 每隔 1s 查询一次
}
```

## 中断方式

当外设准备就绪时，像主机发送一个信号，表示执行主机的命令。

```js
/** 主机 */
const host = {
  /** 命令 */
  command: () => {console.log('print')},
}

/** 外设 */
const equipment = {
  /** 执行主机的某个命令 */
  notice: () => {
    host.command();
  }
}

// xxxxxxx
// 当外设就绪时
equipment.notice();
// xxxxxxx
```
