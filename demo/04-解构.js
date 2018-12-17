// let obj = {
//   name: 'zs',
//   age: 18
// }
// let { name, age } = obj
// console.log(name, age)

let obj = {
  meta: {
    status: 1,
    msg: '成功'
  },
  data: {
    info: '数据'
  }
}
// 在解构中 status，表示对应着对象中的键名，名字需要一样。 inco 表示对应着值 可以任意取名
// let { meta, data } = obj
// console.log(meta, data)
// let {
//   meta: { status: inco, msg },
//   data: { info }
// } = obj
// console.log(inco, msg)
function fn({ meta: { status }, data: { info } }) {
  console.log(status, info)
}
fn(obj)
