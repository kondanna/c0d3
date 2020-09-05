const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Client } = require('pg')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.static('public'))

let users = {} // {<username>: {<username>, <password>, <email>, <fullname>}, ...}
const jwtPassword = 'the securest(sp?) password in the world'

const client = new Client({
    host: process.env.MY_OVH_IP,
    port: 5432,
    user: process.env.MY_OVH_USERNAME,
    password: process.env.MY_POSTGRESQL_PASSWORD,
    database: 'users'
})

app.get('/api/sessions', (req, res) => { 
    const token = (req.get('Authorization') || '').replace('Bearer ', '')
    jwt.verify(token, jwtPassword, (err, decoded) => {
        console.log(token, err, decoded)
        if (err || !decoded || !decoded.username) {
            return res.status(403).json({error: {message: 'unverified'}})
        }
        return res.status(200).json(decoded.username)
    })
})

app.post('/api/users', (req, res) => { 
    const { username, password, email } = req.body || {}
    const emailAlreadyTaken = Object.keys(users).find(username => users[username]['email'] === email)
    const validEmailFormat = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[A-z]+\.[A-z]{3}.?[A-z]{0,3}$/g
    const alphanumeric = /^[a-z0-9]+$/i
    const send400ErrorMsg = (res, message) => res.status(400).send({error: {message}})

    fs.readFile('./users.json', (_err, data) => users = JSON.parse(data))

    if (users[username]) return send400ErrorMsg(res, 'username already taken')
    if (emailAlreadyTaken) return send400ErrorMsg(res, 'email already taken')
    if (!email || !validEmailFormat.test(email)) return send400ErrorMsg(res, 'must enter a valid email')
    if (!username || !alphanumeric.test(username)) return send400ErrorMsg(res, 'username cannot be blank or non-alphanumeric')
    if (!password || password.length < 5) return send400ErrorMsg(res, 'password must be greater than 5 letters')

    bcrypt.hash(password, /*saltRounds*/ 10, (_err, hash) => {
        const token = jwt.sign({ username }, jwtPassword)
        users[username] = {...req.body, password: hash, jwt: token}
        fs.writeFile('./users.json', JSON.stringify(users), () => { console.log('created new user') })
        res.status(201).json(users[username])
    })
})

app.post('/api/sessions', (req, res) => { 
    const { username, password } = req.body || {}
    fs.readFile('./users.json', (_err, data) => users = JSON.parse(data))

    const currentUser = users[username]
    if (!currentUser) return res.status(403).json({error: {message: 'username does not exist'}})

    bcrypt.compare(password, currentUser['password'], (err, passwordMatch) => {
        if (err || !passwordMatch) return res.status(403).json({error: {message: 'password does not match'}})
        return res.status(201).json(currentUser)
    })
})

app.listen(3057, console.log('auth server listening on port 3057'))