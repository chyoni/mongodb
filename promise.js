const addSum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      reject('Parameter must be numbers');
    }
    resolve(a + b);
  });

addSum(10, 20)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

/* 기존 문법 (위는 이 기존문법에서 Promise가 생기고 나서 변환 처리된 코드)
const addSum = (a, b, callback) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return callback("Parameter must be numbers");
    }
    callback(undefined, a+b);
}

addSum(10, 10, (error, sum) => {
    if (error) return console.log(error);
    console.log(sum);
})
*/

// ! Promise를 더 간단하게 사용하는 방법은 Async - Await이다.

const totalSum = async () => {};
