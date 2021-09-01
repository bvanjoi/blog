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
