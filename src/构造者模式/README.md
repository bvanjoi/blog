# 构造者模式

思考这么一个场景：我们要开一家公司，那么，如何来构建公司内的各个部门呢？

首先分析上述行为：

- 部门是我们要**构建的对象**，属于 Product;
- 新建对象的事物，属于 Builder;
- 构建公司的过程属于**管理者**，负责构建顺序，属于 Manager.

假设公司需要新创立两个部门：人力，研发，则我们可以使用下述类来表示：

```JavaScript
/**
 * 基类，表示可以往 Builder 中添加的产品
 */
class Product {
  constructor(name) {
    this.name = name;
  }
}

/** 表示人力部门的类 */
class HR extends Product {
}

/** 表示研发部门的类 */
class RD extends Product {
}

/** 表示公司的类 */
class Company extends Product {
  constructor(name, department) {
    this.name = name;
    this.department = department;
  }
  /** 它具有增加部门的能力 */
  addDepartment(product) {
    this.department.push(product);
  }
}
```

随后，来看创建这些事物的实例：

```javascript
class HRBuilder extends HR {
  build() {
    this.product = new HR(this.name);
    return this.product;
  }
}
class RDBuilder extends RD {
  build() {
    this.product = new RD(this.name);
    return this.product;
  } 
}

class CompanyBuilder extends Company {
  build() {
    this.product = new Company(this.name, this.department);
    return this.product;
  } 
}
// 上面三个类中的 build 的功能一样
// 但是在实际中，可以依据自己的需求来改善功能
```

随后，可以使用诸如`new RDBuilder('rd').build()` 来构建一个 `Product` 实例；

最后，实现管理者的角色：

```JavaScript
/** 没有定义任何行为的管理者，它为基类 */
class Manager {
  constructor(name) {
    this.name = name;
    this.init();
  }
  init() {
  }
  getCompany() {
  }
}

class MyCompanyManager extends Manager {
  init() {
    // 新建名为 hello 公司
    const company = new CompanyBuilder('hello', []).build();
    // 增加 hr 部门
    company.addDepartment(new HRBuilder('hr').build())
    // 增加 rd 部门
    company.addDepartment(new RDBuilder('rd').build())
    // 新增名为 world 的子公司
    company.addDepartment(new CompanyBuilder('world').build())
    this.company = company
  }
  getCompany() {
    return this.company;
  }
}
```

当我们调用名为 `MyCompanyManager` 的类来管理公司时：

```javascript
const myCompany = new MyCompanyManager('helloManager').getCompany();
console.log(myCompany);
// Company {
//   name: 'hello',
//   department: [
//     HR { name: 'hr' },
//     RD { name: 'rd' },
//     Company { name: 'world', department: undefined }
//   ]
// }
```

## 总结

上述代码中，在 `MyCompanyManager.init` 中实现了构建过程：对一个现存的实例，在其上添加更多的实例来增加其内容。

构建者模式中的创建过程比较清晰，有利于分析大型对象的创建过程。

实际运用：

- [lerna 源码中 globalOptions 函数](https://github.com/lerna/lerna/blob/6cb8ab2d4af7ce25c812e8fb05cd04650105705f/core/global-options/index.js#L7)
