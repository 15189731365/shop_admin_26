// promise 是一个对象 通过创建实例进行使用 封装一个异步操作
const fs = require('fs')
// resolve 表示成功的状态
// reject 表示失败的状态
let p1 = new Promise(function(resolve, reject) {
  fs.readFile('./data/a.text', 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})
let p2 = new Promise(function(resolve, reject) {
  fs.readFile('./data/b.text', 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})
let p3 = new Promise(function(resolve, reject) {
  fs.readFile('./data/c.text', 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})
let p4 = new Promise(function(resolve, reject) {
  fs.readFile('./data/d.text', 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

p1.then(data => {
  console.log(data)
  return p2
})
  .then(data => {
    console.log(data)
    return p3
  })
  .then(data => {
    console.log(data)
    return p4
  })
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.log(err)
  })
