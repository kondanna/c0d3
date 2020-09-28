const express = require('express')
const app = express()

app.get('/stars', (req, res) => {
    res.sendFile(`${__dirname}/stars.html`)
})

app.get('/kanban', (req, res) => {
    res.sendFile(`${__dirname}/kanban.html`)
})

app.listen(3000, () => console.log('listening on 3000'))