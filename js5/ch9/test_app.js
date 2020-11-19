const express = require('express');
const Jimp = require('jimp')
const fetch = require('node-fetch')
const app = express();
app.use(express.static('public'))
app.use(express.json({ limit: '10mb' }))
app.use('/', (req, res, next) => {
    fetch('https://js5.c0d3.com/auth/api/session', {
        headers: {
            authorization: req.get('authorization')
        }
    }).then(r => r.json()).then(user => {
        req.user = user
        next()
    })
})
const memesMap = {}
app.post('/api/image', async (req, res) => {
    console.log(req.user);
    const inputData = req.body.inputData
    const imageData = Buffer.from(req.body.imageData, 'base64');
    memesMap[req.user.username] = `${req.user.username}.png`
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
    const img = Jimp.read(imageData)
        .then(image => {
            return image
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .print(font, 0, 0, inputData)
                .write(`./public/${memesMap[req.user.username]}`, () => {
                    res.status(201).json({
                        message: 'Success'
                    })
                }); // save
        })
        .catch(err => {
            console.error(err);
        });
})
app.get('/api/message', (req, res) => {
    res.json(Object.values(memesMap))
})
app.listen(process.env.PORT || 3000, () => {
    console.log('Server Running');
});