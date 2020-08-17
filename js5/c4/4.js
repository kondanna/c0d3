const express = require('express')
const fs = require('fs')
const { uuid } = require('uuidv4')

app = express()
app.use(express.static('public'))
app.use(express.json())

const cache = {}
let filesData = {} // {'some uuid': {name: 'test.js', lastSeen: 1597495994768}, ...}
fs.readFile('./files.json', (_err, data) => {
    filesData = data 
})

app.post('/api/files', (req, res) => {
    const {name, content} = req.body
    const id = uuid()
    const lastSeen = Date.now() 
    filesData[id] = {name, lastSeen}
    fs.writeFile(`./public/files/${name}`, content, () => { console.log('new file added')})
    fs.writeFile('./files.json', JSON.stringify(filesData), () => {})
})

app.get('/api/files/:filename', (req, res) => { 
    const fileName = req.params.filename
    filesData[fileName]['lastSeen'] = Date.now()
})

app.get('/api/files', (req, res) => {// returns sorted array of all filenames
    fs.readdir('./public/files', (_err, filesArr) => { 
        res.json(JSON.stringify(filesArr.sort()))
    })
})

app.listen(3000)