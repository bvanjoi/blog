interface o {
  b1?:()=>void;
  b2?:()=>void
}

class Base {

  public BaseAll:o = {
    b1: () => {
      console.log('b1')
    },
    b2: () => {
      console.log('b2')
    }
  }
}

class Sub extends Base {
  constructor() {
    super();
  }
  public BaseAll:o = {
    ...this.BaseAll,
    b1: () => {
      console.log('b3')
    }
  }
}

const b = new Base();
const s = new Sub();
b.BaseAll.b1()
s.BaseAll.b1();
s.BaseAll.b2();