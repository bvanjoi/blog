function change(amount, coins) {
  const records = [1];
  for (let i = 1; i <= amount; i += 1) {
    records[i] = 0;
  }
  for (const coin of coins) {
    for (let i = 1; i <= amount; i+= 1) {
      if (i >= coin) {
        records[i] += records[i - coin];
      }
    }
  }

  records[0] = undefined; // just for tag.
  console.log(records)
  return records[amount];
}

const assert = require('assert');
const { access } = require('fs');
assert(change(5,[1,2,5]) == 4)
assert(change(3,[2]) == 0)
assert(change(10,[10]) == 1)

console.log('success')