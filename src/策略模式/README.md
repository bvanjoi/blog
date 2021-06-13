# 策略模式

相信做过 ouath 的同学可能会遇到以下代码：

> 所谓 ouath 是指开放授权接口，诸如第三方登入等。

```js
function ouath(type) {
  if (type === 'google') {
    // xxxxx
  } else if (type === 'facebook') {
    // xxxx
  } else if (type === 'twitter') {
    // xxxxx
  }
}
```

上述代码看起来并不优雅，我们可以使用策略模式进行优化。

所谓策略模式，是指对象的某个行为，在不同的场景下有不同的表现。

例如上述代码，就可以改写为：

```js
const strategy = {
  'google': (info) => {
    //xxxxxx
  },
  'facebook': (info) => {
    //xxxxxx 
  },
  'twitter': (info) => {
    //xxxxxx
  }
}

function getOuath(strategy, type, info) {
  return strategy[type](info)
}

```

调用时，则为：

```js
getOuath(strategy, 'google', xxxx)
```
