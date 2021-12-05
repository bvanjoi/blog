type A = () => void;
const a: A = () => { return 'a' };

let a_result = a();
console.log('a_result', a_result)

const b = (): void => { return 'b' }

let b_result = b();
console.log('b_result', b_result)

// 父类
class Animal {
  name: string;
}
// 子类 Dog
class Dog extends Animal {
  bark(): void {}
}
// 子类 Cat
class Cat extends Animal {
  eat(): void {}
}
const d: Animal = new Dog()
const c: Animal = new Cat()

// 协变
function dogBark(d: Dog) {
  d.bark();
}
dogBark(new Dog());
dogBark(new Animal());

// 协变并不安全，因此此时需要不变

let aList: Animal[] = [];
let cList: Cat[] = [];
aList = cList; // 由于协变，可以正确赋值
aList.push(new Dog()); // ts 认为 aList 依旧为 Animal[], 依据协变，Dog 可以被父类型接受
cList.forEach((cat) => {
  // 由于 aList, cList 指向了同一块内存区域
  // cat 的类型可能为 dog.
  cat.eat();
})


// 逆变
let animalEat = (a: Animal) => {
  return a.name;  
}
let dogEat = (d: Dog) => {
  d.bark();
}

animalEat = dogEat;
dogEat = animalEat;

// 双变
interface Comparer<T> {
  compare(a: T, b: T): void;
}

let animalComparer: Comparer<Animal>;
let dogComparer: Comparer<Dog>;

animalComparer = dogComparer;  // Ok because of bivariance
dogComparer = animalComparer;  // Ok
