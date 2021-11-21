// function print(obj) {
//   return Object.fromEntries(
//     Object.entries(obj).map(([key, value]) => [key, `${(value / 1024 / 1024).toFixed(2)} MB`])
//     )
// }

// console.log('init: ', print(process.memoryUsage()))
// let a = new Array(2e7);
// console.log('after new array: ', print(process.memoryUsage()));
// gc();
// console.log('after first gc: ', print(process.memoryUsage()));
// a = undefined;
// gc();
// console.log('after second gc: ', print(process.memoryUsage()));

const fs = require('fs');
const v8 = require('v8');

function createHeapSnapshot() {
  const snapshotStream = v8.getHeapSnapshot();
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `${Date.now()}.heapsnapshot`;
  const fileStream = fs.createWriteStream(fileName);
  snapshotStream.pipe(fileStream);
}

var_take_up_memory = new Array(1e7);
var_take_up_memory.fill(1)

createHeapSnapshot()
