const express = require('express')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.static('public'))

const images = {} // {<uuid>: {<base64Data>, <url>}, ...}

app.get('/api/images', (req, res) => {
    fs.readdir('./public/images', (_err, data) => {
        res.status(200).json(data)
    })
})

app.post('/api/images', (req, res) => {
    const imgID = uuidv4()
    const img = req.body.img
    const url = `/public/images/${imgID}.png`
    images[imgID] = { img, url }
    fs.writeFile(`.${url}`, img, 'base64', () => {
        res.status(201).json({ img, url })
    })
})

app.listen(5000, () => { console.log('listening on port 5000') })