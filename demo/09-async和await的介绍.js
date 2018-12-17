// async与await配合进行使用 async写在函数前面 函数里面需要写 await 一个promise对象
// 用来返回一个成功的promise对象
// await用来暂停async函数 等待promise对象返回
// 因为promise返回的是一个错误对象 所以在async中需要用try catch 来进行接收错误
async function fn() {
  let num = await 11
}
fn()
