const express = require('express')
const fs = require('fs')

const app = express()
app.use(express.json())
app.use(express.static('public'))

const memes = {}

app.get('/api/messages', (req, res) => {
	res.status(200).json('OK')
})

app.post('/api/messages', (req, res) => {

})

app.listen(5000, console.log('listening on port 5000'))