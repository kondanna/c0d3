const express = require('express')
const path = require('path')
const app = express()

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.listen(3000)