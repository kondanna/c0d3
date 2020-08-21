const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('public'))
app.use(express.json())

let messages = {} // {<roomName>: [{<user>, <message>}, ...], ...}
const getMessagesFromDB = () => {
    fs.readFile('./messages.json', (err, data) => {
        if (err) return console.log(err)
        messages = data
    })
}

app.get('/api/session', (req, res) => {
    fetch('https://js5.c0d3.com/auth/api/session', {
        method: 'POST',

    }).then(r => r.json()).then(body => {
        
    })
})

app.get('/api/:room/messages', (req, res) => {
    getMessagesFromDB()
    res.json(messages)
})

app.post('/api/:room/messages', (req, res) => {
    const message = req.body
    message[req.params.room].push(message)
    fs.writeFile('./messages.json', messages, () => console.log('added message'))
})

app.listen(3000)