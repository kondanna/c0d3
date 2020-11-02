const express = require('express')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const app = express()
app.use(express.json({limit: '10mb'}))
app.use(express.static('public'))

const images = {} // {<uuid>: {<base64Data>, <url>}, ...}

app.get('/api/images', (_req, res) => {
    fs.readdir('./public/images', (_err, data) => {
        res.status(200).json(data)
    }) 
})

app.post('/api/images', (req, res) => {
    console.log(req.body)
    res.send(req.body)
    const imgID = uuidv4()
    images[imgID] = {img: req.img, url: `/public/images/${imgID}.png`}
    fs.writeFile(`./public/images/${imgID}.png`, req.img, 'base64', () => { 
        console.log('image saved') 
        res.status(201).json({id: imgID})
    })
})

app.listen(5000, () => { console.log('listening on port 5000') })