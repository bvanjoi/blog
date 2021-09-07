# JavaScript 糟粕

> 随缘分享 JavaScript 中的各种坑以及避免方法。

## `null >= 0` vs `(null > 0) || (null == 0)`

```javascript
null >= 0
// true
null <= 0
// true
null > 0
// false
null == 0
// false
null == 0
// false
```

- 描述：上述代码中，`null >= 0` 成立，而 `null == 0 || null > 0` 却不成立。这种情况与数学上的认知相冲突。
- 成因：上述问题的成因是 ECMA262 中 `==` 与 `>=` 的不同规定导致的；
  - 对于 `==` 操作，如果一侧是对象类型（`null` 在底层是对象类型，可以通过 `typeof null` 来获悉），一侧是数字类型，则将执行 `ToPrimitive(null) == 0` 操作， 由于 `ToPrimitive(null)` 的返回值为自身，因此 `null == 0` 返回 false;
  - 对于 `>` 和 `>=` 这类关系比较操作，由于 `null` 的类型为 `object`, 依据 ECMA 252 的规定，将会调用 ToNumber, 将 null 转化为 +0, 因此 `null >= 0` 成立，`null > 0` 不成立。同理，`null > -1` 的返回结果也为 true.
- 解决：简单而言：别这么写。实际项目中，可以通过 ESlint 禁止不同类型的比较；也可以使用 TypeScript 在编译期间禁止 `null >= 0` 这类表达式。

参考：

- <https://262.ecma-international.org/5.1/#sec-11.8.5> ECMA262 对 `>=` 运算的规定；
- <https://262.ecma-international.org/5.1/#sec-9.3> ECMA262 中规定的 `toNumber`.
- <https://262.ecma-international.org/5.1/#sec-11.9.3> ECMA262 对 `==` 运算的规定；
- <https://262.ecma-international.org/5.1/#sec-9.1> ECMA262 规定的 ToPrimitive 操作。

## 科学计数法与 `parseInt`

两点前置知识：

- JavaScript 中的数字遵从 IEEE754 标准，number 类型均为浮点数。
- parseInt(s, r) 可以用来解析一个字符串并返回指定 r 进制的整数。若 `s` 不是字符串类型，则尝试首先会对其进行 toString 操作；`r` 的值默认为 10.

来看如下代码及运行结果：

```js
parseInt(0.0005)
// 0, 符合预期
parseInt(0.0000005)
// 5, 迷惑
parseInt('0.0000005')
// 0, 符合预期
parseInt(99999999999999)
// 99999999999999
parseInt(9999999999999999)
// 10000000000000000, 迷惑
parseInt(999999999999999999999)
// 1, 迷惑
parseInt('999999999999999999999')
// 1e+21, 迷惑
```

效果如图：

![parseInt 效果](https://img-blog.csdnimg.cn/dbe6ac3af13a4ccfb1c9352d966e9438.png)

下面，来分析原因：

- `parseInt(0.0005)`, `0.0005` 会被转化为字符串 `'0.0005'`, 随后被 parseInt 接受，最终返回结果为 `0`.
- `parseInt(0.0000005)`, `0.0000005` 会被转化为字符串 `5e-7'`, 随后被 parseInt 接受，最终返回结果为 `5`.
- `parseInt('0.0000005')`, `'0.0000005'` 为字符串, 被 parseInt 处理后，最终返回结果为 `0`.
- `parseInt(99999999999999)`, `99999999999999` 转成字符串 `'99999999999999'`, 被 parseInt 处理后，最终返回结果为 `99999999999999`.
- `parseInt(9999999999999999)`, `9999999999999999` 转成字符串 `'9999999999999999'`, 被 parseInt 处理后，由于 IEEE754 浮点数的误差，导致最终返回结果为 `10000000000000000`.
- `parseInt(999999999999999999999)`, `999999999999999999999` 转成字符串 `'1e+21'`, 被 parseInt 处理后，导致最终返回结果为 `1`.
- `parseInt('999999999999999999999')`, `'999999999999999999999'` 为字符串类型，被 parseInt 处理后，由于浮点数误差，最终被以 `'1e+21'` 的形式显示。
