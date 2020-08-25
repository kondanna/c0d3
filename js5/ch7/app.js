const express = require('express')
const multer = require('multer')
const Tesseract = require('tesseract.js')

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.get('api/job/:id', (req, res) => {
    
})

app.listen(3000, () => { console.log('listening on port 3000')})