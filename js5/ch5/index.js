const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('public'))
app.use(express.json())

app.use('/api', (req, res, next) => {
    fetch('https://js5.c0d3.com/auth/api/session', {
        headers: {
            Authorization: req.get('Authorization')
        }
    }).then(r => r.json()).then(data => {
        if (!data || !data.username) {
            return res.status(403).json({
                message: 'User not authorized'
            })
        }
        req.userInfo = data
    }) 
    next()
})

let messages = {} // {<roomName>: [{<user>, <message>}, ...], ...}

app.get('/api/:room/messages', (req, res) => {
    fs.readFile('./messages.json', (err, data) => {
        if (err) return console.log(err)
        messages = data
    })
    res.json(messages[req.params.room])
})

app.post('/api/:room/messages', (req, res) => {
    const roomName = req.params.room
    const message = req.body
    fs.readFile('./messages.json', (err, data) => {
        if (err) return console.log(err)
        messages = data
    })
    const roomMessages = messages[roomName] || []
    roomMessages.push({user: req.userInfo.username, message})
    fs.writeFile(`./messages.json`, JSON.stringify(messages), () => console.log('added message'))
    res.json(messages[roomName])
})

app.listen(3000)