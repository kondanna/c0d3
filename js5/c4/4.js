const express = require('express')
const fs = require('fs')

app = express()
app.use(express.static('public'))
app.use(express.json())

// const cache = {} // {<fileName>: <fileContents>, ...}
let filesData = {} // {<fileName>: {name: <fileName>, lastSeen: Date.now()}, ...}
fs.readFile('./files.json', (_err, data) => {
    filesData = data 
})

const cleanFiles = () => {
    const now = Date.now()
    Object.keys(filesData).forEach(fileName => {
        if (now - filesData[fileName]['lastSeen'] > 300000) {
            fs.unlink(`./public/${fileName}`, (err) => {
                return console.log(err)
            })
        } 
    })
    setTimeout(cleanFiles, 60000)
}

app.post('/api/files', (req, res) => {
    const {name, content} = req.body
    filesData[name] = {name, lastSeen: Date.now()}
    fs.writeFile(`./public/files/${name}`, content, () => { console.log('new file added')})
    fs.writeFile('./files.json', JSON.stringify(filesData), () => {})
    res.json({name: fileName})
})

app.get('/api/files/:filename', (req, res) => { 
    const fileName = req.params.filename
    filesData[fileName]['lastSeen'] = Date.now()
    fs.readFile(`/public/files/${fileName}`, (_err, data) => {
        res.json({name: fileName, content: data})
    })
})

app.get('/api/files', (req, res) => {// returns sorted array of all filenames
    fs.readdir('./public/files', (_err, filesArr) => { 
        res.json(JSON.stringify(filesArr.sort()))
    })
})

app.listen(3000, () => { cleanFiles() })