function p() {
  return p();
}

function test(x, y) {
  if (x == 0) {
    return x;
  } 
  return y();
}

test(0, p());