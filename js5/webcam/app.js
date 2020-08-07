const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(cors({
    credentials: true
}))

app.use(express.static('public'))
app.use(express.json({limit: '10mb'}))

app.options('/images*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', 'req.headers.origin') // req.headers.origin
    res.header('Allow-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Credentials' 
    )
    res.send('ok')
})



app.post('/images', (req, res) => {
    const imgID = Date.now().toString().slice(8)
    fs.writeFile(`./public/${imgID}.png`, req.body.img, 'base64', (err) => {
        console.log(err)
    })
    res.status(201).send(JSON.stringify({link: `http://localhost:3000/${imgID}.png`}))
})

app.listen('3000', () => { console.log("listening on port 3000")})