Function.prototype.myCall = function() {};
Function.prototype.myBind = function() {};
Function.prototype.myApply = function() {};

function consoleThis() {
  console.log(this)
}

consoleThis.call(1,2,3)
consoleThis.apply({a:1}, {b:2})
