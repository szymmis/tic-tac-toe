function a1() {
  return 5;
}

async function a2() {
  return 5;
}

function a3() {
  return new Promise((resolve) => {
    resolve(5);
  });
}

async function b1() {
  console.log(await a3());
}

function b2() {
  let val;
  a3()
    .then((v) => (val = v))
    .then(() => console.log(val));
}

// console.log(a1());
// console.log(a2());
// console.log(a3().then((val) => console.log("From then", val)));
b1();
b2();
