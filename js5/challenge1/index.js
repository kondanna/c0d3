const express = require('express')
const cors = require('cors')
const fs = require('fs')
const fetch = require('node-fetch')
const app = express()

// database: an IP to data mapping and a city to count mapping
// {"::1":{"ip":"37.251.220.49","cityStr":"  RO","lat":46,"long":25,"visits":5},"  RO":{"count":5}}
let visitorStats = {}  

fs.readFile('db.json', (err, data) => {
    if (err) return console.log('error reading file')
    const str = data.toString()
    if (str) visitorStats = JSON.parse(str)
})
// cityStr :: string, ip :: string
const updateStats = (cityStr, ip) => { // {cityStr: {'Bucharest, RO' : 2}, lat: ..., long: ..., ip: ...}
    visitorStats[ip]['visits']++ // visits per IP address
    visitorStats[cityStr]['count']++ // visitors from same city
    fs.writeFile('./db.json', JSON.stringify(visitorStats), () => { console.log('updated db.json') })
}

// middleware
app.use(express.json())
app.set('trust proxy', true)
app.use(async (req, res, next) => {
    const locationInfo = visitorStats[req.ip] // locationInfo :: object
    if (locationInfo) { // if user has been here before increment visit count
        updateStats(locationInfo['cityStr'], req.ip)
        req.locationInfo = locationInfo
        return next() 
    } 
    // if new visitor fetch location data and create new entry
    const {cityStr, ip, ll} = await fetch(`https://js5.c0d3.com/location/api/ip/${req.ip}`).then(r=> r.json())
    visitorStats[req.ip] = {ip, cityStr, lat: ll[0], long: ll[1], visits: 0}
    visitorStats[cityStr] = {count: 0}
    updateStats(cityStr, req.ip)
    req.locationInfo = locationInfo
    return next()
})
// routes
app.get('/visitors', async (req, res) => {
    const {cityStr, ip, lat, long} = req.locationInfo
    const currentCityCount = `Visitors from your city: ${visitorStats[cityStr].count}`
    // visits per city
    const citiesAndCount = Object.keys(visitorStats).reduce((acc, k) => {
        if (visitorStats[k].hasOwnProperty('count')) {
            return `${acc}<a href="/visitors/city/${k}"><h3>${k} - ${visitorStats[k].count}</h3></a>`
        }
        return acc
    }, '')
    // visits per IP address
    const markers = Object.keys(visitorStats).reduce((acc, k) => {
        if (visitorStats[k].hasOwnProperty('cityStr')) {
            return `${acc} 
                new google.maps.Marker({
                    position: {lat: ${visitorStats[k].lat}, lng: ${visitorStats[k].long}},
                    map: map,
                    title: '${visitorStats[k].visits} Hits'
                })`
        }
        return acc   
    }, '')
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>C0D3 Challenge 1</title>
            <link rel="stylesheet" href="https://unpkg.com/papercss@1.7.0/dist/paper.min.css">
            <style>
                .container {
                    margin: auto;
                }
            </style>
        </head>
        <body class="container">
        <h2>You are visiting from ${cityStr}</h2>
        <div id="map" style="width: 100%; height: 500px; position: relative; overflow: hidden;"></div>
        <p>Your public IP is ${ip}</p>
        <p>${currentCityCount}</p>
        <h3>The cities our visitors come from</h3>
        <div><ul>${citiesAndCount}</ul></div>
        </body>
        <script>
            function myMap() {
                var mapProp= {
                    center:new google.maps.LatLng(${lat},${long}),
                        zoom:11,
                    };
                var map = new google.maps.Map(document.getElementById("map"),mapProp);
                ${markers}
            }
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=myMap"></script>
        </html>`)
})

app.get('/visitors/api', async (req, res) => {
    res.json(JSON.stringify(visitorStats))
})

app.listen(3000, () => { console.log('listening on port 3000') })