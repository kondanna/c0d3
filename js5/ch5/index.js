const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('public'))
app.use(express.json())

let messages = {} // {<roomName>: [{<user>: <message>}, ...], ...}
app.use('/api', (req, res, next) => {
    fetch('https://js5.c0d3.com/auth/api/session', {
        headers: {
            Authorization: req.get('Authorization')
        }
    }).then(r => r.json()).then(data => {
        if (!data || !data.username) return res.status(403).json('Not Authorized')
        req.userInfo = data
        next()
    }) 
})

app.get('/api/:room/messages', (req, res) => {
    const roomName = req.params.room
    messages[roomName] = messages[roomName] || []
    res.json(messages[roomName])
})

app.post('/api/:room/messages', (req, res) => {
    const roomName = req.params.room
    messages[roomName] = (messages[roomName] || []).push({user: req.userInfo.username, message: req.body.message})
    fs.writeFile(`./messages.json`, JSON.stringify(messages), () => console.log('added message'))
    res.json(messages[roomName])
})

app.listen(3000)