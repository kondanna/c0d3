const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const session = require('express-session')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.set('trust proxy', 1)
app.use(session({
    secret: 'my secret password',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // encrypts cookie
}))

// cache
let allLessons = []
let allPokemon = []
const pokeUsers = {} // {name: {<name>, <imgUrl>, <lessonsArray>}, <ratingsArray> ...}

const server = new ApolloServer({
    playground: true,
    typeDefs: gql(`
        type User {
            name: String,
            image: String,
            lessons: [Lesson],
            ratings: [Rating]
        }

        type Lesson {
            title: String,
        }

        type Rating {
            title: Lesson,
            rating: Int
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
            user: User,
            lessons: [Lesson],
            search(str: String): [Pokemon],
            getPokemon(str: String): PokemonDetails,
            login(str: String): PokemonDetails,
            getAllPokemon: [Pokemon],
        }

        type Mutation {
            enroll(title: String): [Lesson],
            unenroll(title: String): [Lesson],
            rate(title: String, rating: Int): [Rating]
        }

    `),

    resolvers: {
        Query: {
            user: (_, __, { req }) => {
                const name = req.session.user
                const image = pokeUsers[name]['image']
                const currentlyEnrolled = pokeUsers[name]['lessons'] || []

                const defaultRatings = allLessons.map(lesson => {
                    return { lesson, rating: 0 }
                })
                const userRatings = pokeUsers[name]['ratings'] || defaultRatings

                return {
                    name,
                    image,
                    lessons: currentlyEnrolled,
                    ratings: userRatings
                }
            },

            lessons: () => allLessons,

            search: (_, { str }) => allPokemon.filter(pokemon => pokemon.name.includes(str)),

            /* search: (_, {str}) => fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`).then(r => r.json()).then(data => {
                return data.results.filter(pokemon => pokemon.name.includes(str))
            }), */

            getPokemon: (_, { str }) => {
                return pokeUsers[str]
                    ? pokeUsers[str]
                    : fetch(`https://pokeapi.co/api/v2/pokemon/${str}`)
                        .then(r => r.json()).then(({ name, sprites }) => {
                            pokeUsers[str] = { name, image: sprites.front_default }
                            return pokeUsers[str]
                        })
            },

            login: (_, { str }, { req }) => { // sets session
                const user = pokeUsers[str] || {}
                req.session.user = user.name
                return user
            },

            getAllPokemon: () => allPokemon,
        },

        Mutation: {

            enroll: (_, { title }, { req: { session: { user } } }) => {
                const pokeUser = pokeUsers[user] || {}
                if (!pokeUser) return

                pokeUser.lessons = pokeUser.lessons || []
                if (Object.values(pokeUser.lessons).find(lesson => lesson.title === title)) return pokeUser.lessons
                pokeUser.lessons.push({ title })
                return pokeUser.lessons
            },

            unenroll: (_, { title }, { req: { session: { user } } }) => {
                const pokeUser = pokeUsers[user] || {}
                if (!pokeUser) return

                pokeUser.lessons = pokeUser.lessons || []
                pokeUser.lessons = pokeUser.lessons.filter(lesson => lesson.title !== title)
                return pokeUser.lessons
            },

            rate: (_, { title, rating }, { req: { session: { user } } }) => {
                const pokeUser = pokeUsers[user] || {}
                if (!pokeUser) return

                

            }
        }
    },

    context: ({ req, res }) => {
        return { req, res }
    },
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(process.env.PORT || 8123, () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then(r => r.json()).then(({ results }) => allPokemon = results)
    fetch('https://www.c0d3.com/api/lessons').then(r => r.json()).then(data => allLessons = data)
    console.log('listening on port 8123')
})

// in graphql playground, make sure "request.credentials": "include"