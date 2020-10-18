function permutation(arr:number[]):number[][] {
  let hash = arr.map(v => 0);
  let res: number[][] = [];
  
  const backTracking = (temp:number[], indexBegin: number):number[] => {
    let t2 = temp.map(Number);
    
    if( indexBegin === arr.length) {
      res.push(t2);
      return t2;
    }

    for (let i = 0; i < arr.length; i++) {
      if (hash[i]) {
        continue;
      }
      hash[i] = 1;
      t2.push(arr[i]);
      backTracking(t2, indexBegin + 1);
      t2.pop();
      hash[i] = 0;
    }

    return t2;
  }
  
  backTracking([], 0);
  return res;
}

const input = [1,2,3];
console.log(permutation(input));
