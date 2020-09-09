const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('public'))

// cache
let allPokemon = []
const pokemonCache = {}

const server = new ApolloServer({ 
    playground: true, 
    typeDefs: gql(`
        type Lesson {
            id: ID,
            title: String,
            challenges: [Challenge],
        }

        type Challenge {
            id: ID,
            description: String,
        }

        type Pokemon {
            name: String,
            url: String,
        }

        type PokemonDetails {
            name: String,
            image: String 
        }

        type Query {
            lessons: [Lesson],
            search(str: String): [Pokemon],
            getPokemon(str: String): PokemonDetails,
            getAllPokemon: [Pokemon]
        }
    `), 
    resolvers: {
        Query: {
            lessons: () => fetch('https://www.c0d3.com/api/lessons').then(r => r.json()),

            search: (_, {str}) => allPokemon.filter(pokemon => pokemon.name.includes(str)), 

            /* search: (_, {str}) => fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`).then(r => r.json()).then(data => {
                return data.results.filter(pokemon => pokemon.name.includes(str))
            }), */
                
            getPokemon: (_, {str}) => {
                console.log(pokemonCache)
                if (pokemonCache[str]) return pokemonCache[str]

                return fetch(`https://pokeapi.co/api/v2/pokemon/${str}`).then(r => r.json()).then(({name, sprites}) => { 
                    
                    pokemonCache[str] = { name, image: sprites.front_default }
                    console.log('fetched data!', pokemonCache[str])
                    return pokemonCache[str]
                })
            },

            getAllPokemon: () => allPokemon
            
            /* getAllPokemon: () => fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then(r => r.json()).then(data => data.results) */
        }
    }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(3000, () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then(r => r.json()).then(({results}) => allPokemon = results)
    console.log('listening on port 3000')
})