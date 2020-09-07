const express = require('express')
const fs = require('fs')
const gm = require('gm')
const fetch = require('node-fetch')

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.use('/api/*', (req, res, next) => {
    fetch('http://localhost:3000/api/sessions', {
        headers: {
            Authorization: req.get('Authorization')
        }
    }).then(r => r.json()).then(data => {
        if (!data) return res.status(403).json({error: {message: 'Not Authorized'}})
        req.userInfo = data // {<username>, <jwtToken>}
        next()
    }).catch(console.log)
})

app.get('/api/messages', (req, res) => {
    console.log(req.userInfo)
	fs.readdir('./public/images', (_err, images) => {
		res.status(200).json(images)
	})
})

app.post('/api/messages', (req, res) => {
	const {username, img, msg} = req.body
	const imageData = Buffer.from(img, 'base64')
	gm(imageData).fontSize(70).stroke('#ffffff').drawText(0, 200, msg).write(`./public/images/${username}.png`, () => {
        res.status(201).json({url: `/images/${username}.png`})
    })
})

app.listen(5000, console.log('listening on port 5000'))