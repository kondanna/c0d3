const express = require('express')
const fs = require('fs')

app = express()
app.use(express.static('public'))
app.use(express.json())

const cache = {} // {<fileName>: <fileContents>, ...}
let filesData = {} // {<fileName>: {name: <fileName>, lastSeen: Date.now()}, ...}
fs.readFile('./files.json', (_err, data) => {
    filesData = data 
})

app.post('/api/files', (req, res) => {
    const {name, content} = req.body
    filesData[name] = {name, lastSeen: Date.now()}
    cache[name] = content
    fs.writeFile(`./public/files/${name}`, content, () => { console.log('new file added')})
    fs.writeFile('./files.json', JSON.stringify(filesData), () => {})
})

app.get('/api/files/:filename', (req, res) => { 
    const fileName = req.params.filename
    const now = Date.now()
    if (now - cache[fileName]['lastSeen'] < 300000) return res.json(cache[fileName]) //
    filesData[fileName]['lastSeen'] = Date.now()
    fs.readFile(`/public/files/${fileName}`, (_err, data) => {
        res.json(data) //
    })
})

app.get('/api/files', (req, res) => {// returns sorted array of all filenames
    fs.readdir('./public/files', (_err, filesArr) => { 
        res.json(JSON.stringify(filesArr.sort()))
    })
})

app.listen(3000)