# JavaScript 中的继承

JavaScript 中的类与 C++/Java 中的继承机制非常不同。

因为 JavaScript 采用了基于原型的继承机制。而 C++/Java 采用了基于类的继承机制。

## JavaScript 中的对象

ECMAScript 中没有定义类的概念，因此其对象的概念也与 C++/Java 中的对象概念不同。

在 ECMAScript-262 中明确定义对象的概念："An object is a collection of properties and has a single prototype object. The prototype may be the null value."

即，对象是一组属性的集合，且只有一个原型对象，同时，该原型对象可能为空。

- 属性的集合：对象包含一组无序的键值对，其值可以是数据或函数；
- 原型对象：该对象的 `__proto__` 指向的对象。

### 最简单的对象

早期 JavaScript 开发者创建对象的方式：

```javascript
var person = new Object();
person.name = 'Jack';
person.age  = 20;
person.sayName = function() {
  console.log(person.name);
};
```

随后，字面量创建对象的方式流行开来：

```javascript
var person = {
  name: 'Jack',
  age: 20,
  sayName: function() {
    console.log(this.name);
  }
}
```

### `__proto__` 和 `prototype`

- `__proto__`: 隐式原型，该属性的作用是：如果在当前对象 obj 找不到某属性，则会沿着其 `obj.__proto__` 继续寻找。JavaScript 中的**任何对象**都有一个内置属性 `[[prototype]]`, ES5 之前没有标准方法来访问该内置属性，但大多数浏览器都通过 `__proto__` 来访问。ES5 中增加了对这个内置属性标准的 get 方法 `Object.getPrototypeOf()`.
- `prototype`: 显示原型，**函数**创建之后都会有一个名为 `prototype` 的属性，这个属性指向函数的原型对象。

对象的 `__proto__` 指向的是其构造函数的 `prototype`.

例如：

```javascript
var obj = {x:1};
console.log(obj.__proto__ === Object.prototype); //true
var num = 1;
console.log(num.__proto__ === Number.prototype); // true
```

## 继承

我们介绍几种实现继承的方式：

### 原型链实现继承

JavaScript 中的继承机制可以由原型链实现的。其基本思想为**利用原型让一个引用类型继承另外一个引用类型的属性和方法**。

首先，通过原型链定义一个基类：

```javascript
function Animal(specie) {
  this.specie = specie;
}
Animal.prototype.getSpecie = function() {
  return 'I\'m ' + this.specie;
}
```

随后，创建一个类 `Cat`, 通过 `prototype` 将其原型对象指向 Animal 的实例。

```javascript
function Cat() {}
Cat.prototype = new Animal('cat');
```

此时 `Cat` 就已经成为 `Animal` 的子类，且包含方法`getSpecie`.

创建其实例检测：

```javascript
var cat = new Cat();
console.log(cat.getSpecie()) // I'm cat
```

原型链实现继承的问题：

- 引用类型的原型属性会被所有实例共享。

实例：

```javascript
function BaseClass() {
  this.arr = ['a','b'];
}

function SubClass() {}
SubClass.prototype = new BaseClass();
var subInstance = new SubClass();
subInstance.arr.push('c'); // 相当于 SubClass 的构造函数（BaseClass的某一个实例）的arr发生了变化
console.log((new SubClass()).arr); // [ 'a', 'b', 'c']
```

### 借用构造函数

为了解决原型链继承带来的问题，开发者开始使用**借用构造函数**方法来实现继承。

该方法的思想很简单：**在子类构造函数内部调用基类的构造函数**。

还是上例的基类：

```javascript
function BaseClass() {
  this.arr = ['a','b'];
}
```

但是子类的定义更改为：

```javascript
function SubClass() {
  BaseClass.call(this); // 当 new SubClass 时，将 SubClass 的 this 中初始化了 arr 属性。
}
```

通过 `call` 来强制改变 `this` 的指向，当执行 `new SubClass()`时，相当于在 `SubClass` 的实例的 `this` 上依据 `BaseClass` 初始化了 `arr`.

每次 new 操作都相当于**初始化**了一次 `arr` 内容，因此不存在原型链继承中的共享引用类型的问题。

实例：

```javascript
var subInstance = new SubClass();
subInstance.arr.push('c');
console.log((new SubClass()).arr); // [ 'a', 'b' ]
```

借用构造函数实现继承的问题：

- 无法实现函数复用。

例如：

```javascript
function Animal(specie) {
  this.specie = specie;
}
Animal.prototype.getSpecie = function() {
  return 'I\'m ' + this.specie;
}

function Cat() {
  Animal.call(this, 'cat');
}

var cat = new Cat();
console.log(cat.getSpecie()) // not a function.
```

### 组合继承

组合继承将原型链继承和借用构造函数继承二者相结合，其思想是：**使用原型链来实现对原型属性和方法的继承，使用借用构造函数来实现对实例属性的继承**。

其示例可以如下：

```javascript
function Animal(specie) {  
  this.specie = specie;
  this.arr = ['a','b'];
}
Animal.prototype.getSpecie = function() {
  return 'I\'m ' + this.specie;
}

function Cat(specie) {
  Animal.call(this, specie);
}
Cat.prototype = new Animal();
var cat = new Cat('cat');
cat.arr.push('c');
console.log(cat.getSpecie()); // I'm a cat
console.log(cat.arr); // ['a','b','c']
console.log((new Cat()).arr); // ['a','b']
```

组合继承融合二者优点，又避免了二者的缺点，成为了 JavaScript 中最常见的继承实现方式。

但组合继承也有自己的问题：

- 调用了两次基类的构造函数。（一次在创造子类原型；一次在子类构造函数内部）

### 原型式继承

原型式继承**不是**原型链继承。

原型式继承的思想在于：**借助已有的对象创建新的对象**。

示例：

```javascript
var person = {
  name: 'Jack',
  friends: ['Lily', 'Mickle'],
  toString: function() {
    return 'name: ' + this.name + ' friends: ' + this.friends;
  }
}

var anotherPerson = Object.create(person);

console.log(anotherPerson.toString()) // name: Jack friends: Lily,Mickle

anotherPerson.name = 'Cook';
anotherPerson.friends.push('Bob')
console.log(anotherPerson.toString()) // name: Cook friends: Lily,Mickle,Bob

console.log(Object.create(person).toString()) //name: Jack friends: Lily,Mickle,Bob
```

其中，`var a = Object.create(b)` 会使得变量 `a` 的 `__proto__` 指向 `b`.

原型式继承的问题：

- 共享引用值

### 寄生式继承

寄生式继承与原型式继承紧密相关，其思想与工厂模式类似，即**创建一个仅用于封装继承过程的函数**。

示例：

```javascript
function createAnother(original) {
  var clone = Object.create(original);
  clone.sayHi = function() {
    console.log('Hi');
  }
  return clone;
}
var person = {
  name: 'Jack',
  friends: ['Lily', 'Mickle'],
}
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // Hi
```

`createAnother`函数以 `original` 对象为基类，创建一个指向其的新对象，随后为新对象添加属性或方法。

寄生式继承的问题：

- 无法实现函数复用。

### 寄生组合式继承

寄生组合式继承的思想：**使用寄生式继承来继承基类的原型，然后将指定结果指定给子类的原型**。

其示例为：

```javascript
function inheritPrototype(SubClass, BaseClass) {
  var prototype = Object.create(BaseClass.prototype);
  prototype.constructor = SubClass;
  SubClass.prototype = prototype;
}

function BaseClass(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

BaseClass.prototype.sayName = function() {
  console.log(this.name);
}

function SubClass(name, age) {
  BaseClass.call(this, name);
  this.age = age;
}

inheritPrototype(SubClass,BaseClass);
```

## ES6 中的继承

在 ES6 中，我们可以这样实现继承：

```javascript
class Animal {
  constructor(specie) {
    this.specie = specie;
  }
  getSpecie = function(){
    return 'I\'m ' + this.specie;
  }
}

class Cat extends Animal {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  getAge() {
    return 'I\'m ' + this.age;
  }
}

const cat = new Cat('cat', 20);
console.log(cat.getSpecie()); // I'm cat
console.log(cat.getAge());    // I'm 20
```

其实，ES6 中的 `class..extends`本质是语法糖，其本质是组合继承。

大致代码为：

```javascript
function Animal(specie) {
  this.specie = specie;
}

Animal.prototype.getSpecie = function() {
  return 'I\'m ' + this.specie;
}

function Cat(specie, age) {
  Animal.call(this, specie);
  this.age = age;
}

Cat.prototype = new Animal();
Cat.prototype.getAge = function() {
  return 'I\'m ' + this.age;
}

const cat = new Cat('cat',20);
console.log(cat.getSpecie()); // I'm cat
console.log(cat.getAge());    // I'm 20
```

### super 是什么

在子类的 `constructor` 函数中，`super` 的作用为 `constructor.bind(this)`.
