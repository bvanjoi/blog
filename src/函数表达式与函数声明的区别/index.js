a();

function a() {
 return 1;
}

b(); // ReferenceError: Cannot access 'b' before initialization
const b = function() {return 2;}