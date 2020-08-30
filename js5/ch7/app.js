const express = require('express')
const multer = require('multer')
const Tesseract = require('tesseract.js')
const { v4: uuidv4 } = require('uuid')

const app = express()
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now().toString().slice(6)}-${file.originalname}`)
        }
    })
})

app.use(express.json({limit: '10mb'}))
app.use(express.static('public'))

const jobs = {} // {<jobID>: {completed: false, results: [<*.png>, <*.jpeg>, ...]}

app.post('/files', upload.array('images'), (req, res) => {
    const id = uuidv4()
    jobs[id] = {completed: false, results: []}

    req.files.forEach(image => {
        Tesseract.recognize(`./${image.path}`, 'eng').then(data => {
            jobs[id]['results'].push(data)
            if (jobs[id]['results'].length === req.files.length) {
                jobs[id]['completed'] = true
            }
        })
    })
    res.json({id})
})

app.get('/api/job/:id', (req, res) => {
    const job = jobs[req.params.id]
    if (!job) return res.status(400).json({error: {message: 'Job does not exist'}})
    res.json(job)
})

app.listen(5000, () => { console.log('listening on port 5000')})