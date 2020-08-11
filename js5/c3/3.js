const express = require('express')
const cors = require('cors')
const Jimp = require('jimp')
const fs = require('fs')

app = express()
app.use(express.json())
app.use(cors())

const imgCache = {} 

app.get('/memegen/api/:memetext/', async (req, res) => {

    const memeText = req.params.memetext || ''
    const blur = +req.query.blur || 1  
    const imgUrl = req.query.src || 'https://placeimg.com/640/480/any'
    const font = req.query.black ? Jimp.FONT_SANS_32_BLACK : Jimp.FONT_SANS_32_WHITE
    const cacheID = `${memeText}-${imgUrl}-${blur}-${font}`

    if (imgCache[cacheID]) return res.set('Content-Type', 'image/jpeg').send(imgCache[cacheID])

    const image = await Jimp.read(imgUrl)
        .then(img => img.blur(blur))
        .then(img => req.query.greyscale ? img.greyscale() : img)

    image.print(await Jimp.loadFont(font), 0, 0, {
            text: memeText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP
        }, 640, 360)

    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)

    // update cache if new params / query
    imgCache['count'] = (imgCache['count'] || 0) + 1
    if (imgCache['count'] <= 10) imgCache[cacheID] = buffer
    console.log(imgCache)

    res.set('Content-Type', 'image/jpeg').send(buffer)
})

app.listen(3000, console.log('localhost:3000'))