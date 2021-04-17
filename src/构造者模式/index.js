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
    super(name)
    this.department = department;
  }
  /** 它具有增加部门的能力 */
  addDepartment(product) {
    this.department.push(product);
  }
}

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