const acorn = require('acorn');

function opPlugin(Parser) {
  return class extends Parser {
    parseParenExpression() {
      return this.parseExpression();
    }
  };
}

const opParse = acorn.Parser.extend(opPlugin)

describe("op parse", function() {
  it('if-else', function() {
    expect(opParse.parse(`if 1 > 2 {} else if 2 > 2 {} else {}`)).toMatchSnapshot()
  })

  it('while', function() {
    expect(opParse.parse(`let a = 2; while a > 0 {a-=1;}`)).toMatchSnapshot()
  })

  it('do-while', function() {
    expect(opParse.parse(`do {} while 2 < 1`)).toMatchSnapshot()
  })

  it('switch', function() {
    expect(opParse.parse(`const d = 2; switch d {case 1: break; default: break;}`)).toMatchSnapshot()
  })
})

describe('normal javascript parse', function() {
  it('if-else', function() {
    expect(opParse.parse(`if (1>2) {} else if (2 > 2) {} else {}`)).toMatchSnapshot()
  })

  it('while', function() {
    expect(opParse.parse(`let a = 2; while (a > 0) {a-=1;}`)).toMatchSnapshot()
  })

  it('do-while', function() {
    expect(opParse.parse(`do {} while (2 < 1)`)).toMatchSnapshot()
  })

  it('switch', function() {
    expect(opParse.parse(`const d = 2; switch (d) {case 1: break; default: break;}`)).toMatchSnapshot()
  })

  it('function', function() {
    expect(opParse.parse(`function div(a,b) {return a - b;}`)).toMatchSnapshot()
  })  

  it('arrow-function', function() {
    expect(opParse.parse(`const add = (a,b) => a + b;`)).toMatchSnapshot()
  })  
})