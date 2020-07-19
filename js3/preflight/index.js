const request = require('request')
const fetch = require('node-fetch')
const fs = require('fs')

/* request('https://pokeapi.co/api/v2/pokemon', (err, res, body) => {
    const pokemon = JSON.parse(body)
    const pokemonHTML = pokemon.results.reduce((acc, p) => `${acc}<h1>${p.name}</h1>`, '')
    fs.writeFile('names.html', pokemonHTML, () => { console.log('pokemons') })
}) */

/* request('https://api.openaq.org/v1/countries', (err, res, body) => {
    const countries = JSON.parse(body)
    const mostCities = countries.results.reduce((acc, country) => country.cities > acc.cities ? country : acc, countries.results[0])
    console.log(mostCities.name)
}) */

fetch('https://pokeapi.co/api/v2/pokemon').then(response => {
    return response.json()
}).then(data => {
    const fetchPromises = data.results.map(pokemon => {
        return fetch(pokemon.url).then(pokeDetails => {
            return pokeDetails.json() 
        })
    }) // returns an array of promises to pokemon details
    return Promise.all(fetchPromises)
}).then(dataList => dataList.reduce((acc, pokemon) => pokemon.weight >= acc.weight ? pokemon : acc, dataList[0]))
  .then(pokemon => { console.log(pokemon.name) })

/* request('https://pokeapi.co/api/v2/pokemon', (err, res, body) => {
    const pokemon = JSON.parse(body)
    const pokeList = []
    pokemon.results.forEach(p => {
        const name = p.name
        request(p.url, (err, res, body) => {
            const stats = JSON.parse(body)
            const weight = stats.weight
            pokeList.push({ name, weight })
        })
        if (pokemon.results.length === pokeList.length) {
            const heaviest = pokeList.reduce((acc, pokemon) => pokemon.weight >= acc.weight ? pokemon : acc, dataList[0])
            console.log(heaviest)
        }
    })
}) */