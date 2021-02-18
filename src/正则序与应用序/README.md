# 正则序与应用序

首先，来看一段 scheme 代码：

```scheme
; 定义 square(x){ return x * x}
(define (square x) (* x x))
; 定义 sum-of-squares(x, y) {return square(x) + square(y)}
(define (sum-of-squares x y) (+ (square x) (square y)))
; 定义 f(a){ return sum-of-squares(a + 1, a + 2)}
(define (f a) (sum-of-squares (+ a 1)(* a 2)))
; 展示 f(5)
(display (f 5))
; 结果 136
```

对于上述代码，我们来看两种求值模型：

## 正则序求值

正则序求值是**完全展开而后归约**的过程。

```txt
初始  (f 5)
展开  (sum-of-squares (+ 5 1) (* 5 2))
展开  (+ (square (+ 5 1)) (square (* 5 2)))
展开  (+ (* (+ 5 1)(+ 5 1)) (* (* 5 2)(* 5 2)))
归约  (+ (* 6 6)            (* (10 10)))
归约  (+ 36                 100)
归约  136
```

## 应用序求值

应用序求值是**先求值参数而后应用**的过程。

```txt
初始  (f 5)
替换  (sum-of-squares (+ a 1) (* a 2))
替换  (sum-of-squares (+ 5 1) (* 5 2))
归约  (+ (square 6)(square 10))
归约  (+ (* 6 6)(* 10 10))
归约  (+ 36 100)
归约  136
```

Lisp 采用*应用序*求值，部分原因在于避免表达式的重复求值。

## 区分二者的示例

考虑以下两个过程：

```scheme
(define (p) (p))  ; 调用自身的无限循环

(define (test x y)
  (if (= x 0)
      0
      y
  )
)
```

然后，求值：

```scheme
(test 0 (p))
```

- 如果采用应用序求值，则在 `(test 0 (p))` 时，会陷入无限循环。
- 如果采用正则序求值，此时参数在被需要调用时才被求值，而又因为 `x=0` 成立，所以此时会返回 `0`.

### 应用到 js 中

```javascript
function p() {
  return p();
}

function test(x, y) {
  if (x == 0) {
    return x;
  }
  return y();
}

console.log(test(0, p()));
```

运行后可以看出，v8 属于应用序求值。
