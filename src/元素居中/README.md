# 元素居中

元素居中分为两类：水平居中，垂直居中。

## 水平居中

- `inline` 元素： `text-align: center;`.
- `block` 元素：`margin: 0 auto;`.

## 垂直居中

- `inline` 元素： `line-height: $height`.

## 水平垂直居中

- `position: absolute; top: 50%; left: 50%; transition: transform(-50%, -50%);`
- `display: flex; align-items: center; justify-center: center;`
- `display: grid; align-items: center; justify-center: center;`
