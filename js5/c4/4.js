const express = require('express')
const fs = require('fs')

app = express()
app.use(express.static('public'))

let filesData = {} // {'1597495994768': {name: 'test.js', createdAt: 1597495994768}, ...}
fs.readFile('./files.json', (_err, data) => {
    filesData = data 
})

app.post('/api/files', (req, res) => {
    const {name, content} = req.body.data
    const createdAt = Date.now() // also the file ID
    filesData[createdAt] = {name, createdAt}
    fs.writeFile(`./files/${name}`, content, () => { console.log(`New file created at ${createdAt}`)})
    fs.writeFile('./files.json', JSON.stringify(filesData), () => {})
})

app.get('/api/files/:filename', (req, res) => {
    const fileName = req.params.filename
    fs.readdir('./files', (_err, filesArr) => { // returns array of all filenames
        
    })
})

app.listen(3000)