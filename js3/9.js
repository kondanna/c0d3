const fetch = require('node-fetch')
const fs = require('fs')

fetch('https://pokeapi.co/api/v2/pokemon').then(r => r.json()).then(({results}) => {
    const fetchPromises = results.map(pokemon => fetch(pokemon.url)).then(pokeDetails => pokeDetails.json())

    return Promise.all(fetchPromises)}).then(pokeDetails => {
        const html = pokeDetails.reduce((acc, p) => `${acc}<h3>${p.name}</h3><img src="${p.sprites['front_default']}"/><br/>`, '')
        fs.writeFile('9.html', html, () => {})
    })