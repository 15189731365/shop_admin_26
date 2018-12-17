// promise 是一个对象 通过创建实例进行使用 封装一个异步操作
const fs = require('fs')
// resolve 表示成功的状态
// reject 表示失败的状态
// let p1 = new Promise(function(resolve, reject) {
//   fs.readFile('./data/a.text', 'utf8', (err, data) => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve(data)
//     }
//   })
// })
// let p2 = new Promise(function(resolve, reject) {
//   fs.readFile('./data/b.text', 'utf8', (err, data) => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve(data)
//     }
//   })
// })
// let p3 = new Promise(function(resolve, reject) {
//   fs.readFile('./data/c.text', 'utf8', (err, data) => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve(data)
//     }
//   })
// })
// let p4 = new Promise(function(resolve, reject) {
//   fs.readFile('./data/d.text', 'utf8', (err, data) => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve(data)
//     }
//   })
// })

function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function fn() {
  try {
    let a = await read('./data/a.text')
    console.log(a)
    let b = await read('./data/b.text')
    let c = await read('./data/c.text')
    let d = await read('./data/d.text')
  } catch (e) {
    // 因为await只返回promise成功的结果 所以需要用try catch来捕获失败的结果
    console.log(e)
  }
}

// read('./data/a.text')
//   .then(data => {
//     console.log(data)
//     return read('./data/b.text')
//   })
//   .then(data => {
//     console.log(data)
//     return read('./data/c.text')
//   })
//   .then(data => {
//     console.log(data)
//     return read('./data/d.text')
//   })
//   .then(data => {
//     console.log(data)
//   })
//   .catch(err => {
//     console.log(err)
//   })
