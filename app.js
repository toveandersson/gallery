
const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const port = 3001
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})


// get all files
// const homePage = readFileSync('./index.html')
// const homeStyles = readFileSync('./styles/styles.css')
// const homeLogic = readFileSync('./app.js')


// function alertButton(){
//     alert("Köpa? Det går inte än:( testa att swisha mig direkt istället:)")
// }

// const server = http.createServer((req, res) => {
//     // console.log(req.method)
//     const url = req.url
//     console.log(url)
//     // home page
//     if (url === '/') {
//       res.writeHead(200, { 'content-type': 'text/html' })
//       res.write(homePage)
//       res.end()
//     }
//     // about page
//     else if (url === '/about') {
//       res.writeHead(200, { 'content-type': 'text/html' })
//       res.write('<h1>about page</h1>')
//       res.end()
//     }
//     // styles
//     else if (url === '/styles.css') {
//       res.writeHead(200, { 'content-type': 'text/css' })
//       res.write(homeStyles)
//       res.end()
//     }
//     // logic
//     else if (url === '/app.js') {
//       res.writeHead(200, { 'content-type': 'text/javascript' })
//       res.write(homeLogic)
//       res.end()
//     }
//     // 404
//     else {
//       res.writeHead(404, { 'content-type': 'text/html' })
//       res.write('<h1>page not found</h1>')
//       res.end()
//     }
//   })

// app.listen(port, console.log(`server listen ${port}`))