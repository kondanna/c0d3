const fetch = require('node-fetch')
const fs = require('fs')

fetch('https://pokeapi.co/api/v2/pokemon').then(response => {
    return response.json()
}).then(data => {
    const fetchPromises = data.results.map(pokemon => {
        return fetch(pokemon.url).then(pokeDetails => {
            return pokeDetails.json() 
        })
    }) // returns an array of promises to pokemon details
    return Promise.all(fetchPromises)
}).then(pokeDetails => {
    const html = pokeDetails.reduce((acc, p) => `${acc}<h3>${p.name}</h3><img src="${p.sprites['front_default']}"/><br/>`, '')
    fs.writeFile('9.html', html, () => {})
})