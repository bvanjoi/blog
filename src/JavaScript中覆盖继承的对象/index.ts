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

const base1 = new Base();
const s = new Sub();
base1.BaseAll.b1()
s.BaseAll.b1();
s.BaseAll.b2();