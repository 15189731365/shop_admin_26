const fs = require('fs')

fs.readFile('data/a.text', 'utf8', (err, data) => {
  if (err) console.log('错误', err)
  console.log(data)
  fs.readFile('data/b.text', 'utf8', (err, data) => {
    if (err) console.log('错误', err)
    console.log(data)
    fs.readFile('data/c.text', 'utf8', (err, data) => {
      if (err) console.log('错误', err)
      console.log(data)
      fs.readFile('data/d.text', 'utf8', (err, data) => {
        if (err) console.log('错误', err)
        console.log(data)
      })
    })
  })
})
