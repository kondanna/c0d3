const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const { v4: uuid }= require('uuid')
app.use(cors())

let visitorCount = 0

app.get(['/', '/hello'], (req, res) => {
    let color = 'black'
    const ua = req.get('user-agent').toLowerCase()
    console.log(ua)
    if (ua.includes('mozilla/')) color = 'blue'
    if (ua.includes('chrome/')) color = 'red'
    res.send(`<h1 style="color:${color}">Hello world!</h1>`)
})

app.get('/ignore', (req, res) => {
    console.log('ouch', Date.now())
    res.set('Cache-Control', 'max-age=120')
    setTimeout(() => {
        res.send('<h1>Cached page</h1>')
    }, 3000)
})

app.get('/abtest', (req, res) => {
    const r = Math.floor(Math.random() * 10)
    const cookie = req.get('cookie')
    const color = r < 3 ? 'red' : 'blue'
    visitorCount++
    res.send(`<h1 style="color:${visitorCount % 5 == 0 ? 'green' : 'red'}">Hello World</h1>`)
})

app.get('/getfile', (req, res) => {
    // res.sendFile(path.join(__dirname, 'hello.txt'))
    fs.readFile('./hello.txt', (err, data) => {
        if (err) return res.status(500).send('Error reading file')
        res.send(`<p>File contents: ${data}</p>`)
    })
})

app.get('/uniques', (req, res) => {
    const cookie = req.get('cookie') || ''
    const parsedCookie = cookie.split(';').find(str => str.includes('guid=')) || ''
    let guid = parsedCookie.split('=')[1]
    if (parsedCookie) {
        res.send(`
            <h1>You have been identified with guid ${guid}</h1>
            <h3>Distinct Visitors Count: ${visitorCount}</h3>`)
    } else {
        guid = uuid()
        visitorCount++
        res.set({
            'set-cookie': `guid=${guid}` // cookies must be key / value pair
        })
        res.send(`
            <h1>You have been ASSIGNED a guid ${guid}</h1>
            <h3>Distinct Visitors: ${visitorCount}</h3>`)
    }
})

app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Allow-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Credentials' 
    )
    res.send('ok')
})

app.put('/api/*', (req, res) => {
    res.send('<h1>PUT request received</h1>')
})

app.post('/api/*', (req, res) => {
    res.send('<h1>POST request received</h1>')
})

app.delete('/api/*', (req, res) => {
    res.send('ok')
})

app.listen(3000)