const express  = require('express')
const fetch = require('node-fetch')
const app = express()
const cache = {}
const addressData = {}
const updateAddressData = (vAddress) => {
  const cityInfo = addressData[vAddress.cityStr] || {}
  const llKey = JSON.stringify(vAddress.ll)
  cityInfo[llKey] = (cityInfo[llKey] || 0 ) + 1
  addressData[vAddress.cityStr] = cityInfo
}
app.use(express.static('public'));
const getHTML = (cityStr, longLat) => {
  const visitors = Object.keys(addressData).reduce((acc, cityStr) => {
    const locationMap = addressData[cityStr]
    const totalCount = Object.values(locationMap).reduce((acc, v) => {
      return acc + v
    }, '')
    return acc + `
      <a class='bb' href="/location/city/${cityStr}">
        <h2>${cityStr} - ${totalCount}</h2>
      </a>
    `
  }, '')
  const style = `
    #gMap {
      height: 500px;
    }
  `
  const script = `
    function initMap() {
      // The location of Place
      let llLocation = {lat: ${longLat[0]}, lng: ${longLat[1]}};
      
      // The map, centered at location
      let map = new google.maps.Map(
        document.getElementById('gMap'), {zoom: 10, center: llLocation}
      );
      
      // The marker, positioned at location
      let marker = new google.maps.Marker({position: llLocation, map: map});
    }
  `
  return `
    <style>${style}</style>
    <h1>You're visiting from ${cityStr}</h1>
    <div id='gMap'></div>
    <h1>The cities visitors came from: </h1>
    <div>${visitors}</div>  
    <script>${script}</script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=initMap"></script>
  `
}
app.get(`/`, async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.ip
  let vAddress = cache[ipAddress]
  if(vAddress) {
    updateAddressData(vAddress)
    cache[ipAddress] = vAddress
    return res.send(`<h1>You're visiting from ${vAddress.cityStr}</h1>`)
  }
  vAddress = await fetch(`https://js5.c0d3.com/location/api/ip/${ipAddress}`).then( r => {
    return r.json()
  })
  console.log(vAddress);
  updateAddressData(vAddress)
  const htmlStr = getHTML(vAddress.cityStr, vAddress.ll)
  res.send(htmlStr)
})
app.get('/location/city/:cityname', (req, res) => {
  console.log(req.params.cityname) // should be San Jose, CA US
  const cityname = req.params.cityname
  const locationMap = addressData[cityname]
  const firstLL = JSON.parse(Object.keys(locationMap)[0])
  
  // console.log(locationMap); 
  const htmlStr = getHTML(cityname, firstLL)
  res.send(htmlStr)
})
app.get(`/api/visitors`, (req, res) => {
  res.json(addressData)
})
app.listen(3000)