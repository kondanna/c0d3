const express = require('express')
const cors = require('cors')
const fs = require('fs')
const fetch = require('node-fetch')
const app = express()

// database: an IP to data mapping and a city to count mapping
const visitorStats = {} // '37.251.220.49': {city: {cityStr: 'Bucharest, RO', count: 2}, lat: ..., long: ..., ip: ...} 
const visitorsPerCity = {}

fs.readFile('db.json', (err, data) => {
    if (err) return console.log('error reading file')
    const str = data.toString()
    if (str) visitorStats = JSON.parse(str)
})

const updateStats = ({city}) => { // {cityStr: {'Bucharest, RO' : 2}, lat: ..., long: ..., ip: ...}
    visitorStats[city][count] = (visitorStats[city][count] || 0) + 1
    fs.writeFile('./db.json', JSON.stringify(visitorsPerCity), () => { console.log('updated db.json') })
}

// middleware
app.use(express.json())
app.set('trust proxy', true)

app.use(async (req, res, next) => {
    if (visitorStats[req.ip]) { // if user has been here before increment visit count
        updateStats(visitorStats[req.ip])
        return next() 
    } 
    // if new visitor fetch location data
    const {cityStr, ip, ll} = await fetch(`https://js5.c0d3.com/location/api/ip/${ip}`).then(r=> r.json())
    visitorStats[ip] = {ip, lat: ll[0], long: ll[1], city: {cityStr, count: 0}}
    updateStats(ip)
    return next()
})
// routes
app.get('/visitor', (req, res) => {
            const $citiesAndCount = Object.keys(visitorStats).reduce((acc, ipAddress) => {
                return `${acc}<li>${visitorStats[ipAddress].cityStr} - ${visitorStats[k].count}</li>`
            }, '')///////////

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
                <h1>The cities our visitorStats come from</h1>
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

app.get('/visitorStats/api', (req, res) => {
    res.json(JSON.stringify(visitorStats))
})

app.listen('3000', () => { console.log('listening on port 3000') })