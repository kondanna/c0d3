const express = require('express')
const cors = require('cors')
const fs = require('fs')
const fetch = require('node-fetch')
const app = express()

// database
let visitors = {} // '37.251.220.49': {location: ..., visits: ...}, ...
fs.readFile('db.json', (err, data) => {
    if (err) return console.log('error reading file')
    const str = data.toString()
    if (str) visitors = JSON.parse(str)
})

// middleware settings
app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.set('trust proxy', true)
app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Allow-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, X-Forwarded-For, Content-Type, Accept, Credentials' 
    )
    res.send('ok')
})

// routes
app.get('/visitors', (req, res) => {
    fetch(`https://js5.c0d3.com/location/api/ip/${req.ip}`)
        .then(r => r.json())
        .then(data => {
            const location = data['cityStr']
            const coordinates = {lat: data['11'][0], long: data['11'][1]}
            visitors[req.ip] ? visitors[req.ip].count++ : visitors[req.ip] = {location, count: 1}
            fs.writeFile('./db.json', JSON.stringify(visitors), () => { console.log('updated db.json') })

            const $citiesAndCount = Object.keys(visitors).reduce((acc, k) => {
                return `${acc}<li>${visitors[k].location} - ${visitors[k].count}</li>`
            }, '')

            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>C0D3 Challenge 1</title>
                    <link rel="stylesheet" href="https://unpkg.com/papercss@1.7.0/dist/paper.min.css">
                </head>
                <body>
                <h1>You are visiting from ${location}</h1>
                <p>Your public IP is ${req.ip}</p>
                <div id="map"></div>
                <h1>The cities our visitors come from</h1>
                <div><ul>${$citiesAndCount}</ul></div>
                </body>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=currentMap"></script>
                <script>
                    function currentMap() {
                        const coords = ${coordinates}
                        const gmap = new google.maps.Map(document.querySelector('#map'), {zoom: 11, center: coords})
                        const marker = new google.maps.Marker({position: coords, map: gmap})
                    }
                </script>
                </html>`)
        })
})

app.get('/visitors/api', (req, res) => {
    res.json(JSON.stringify(visitors))
})

app.listen('3000', () => { console.log('listening on port 3000') })