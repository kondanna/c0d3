const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const 

const app = express()
app.use(express.json())
app.use(express.static('public'))

const users = {}
app.get('/api/sessions', (req, res) => { // called as middleware

    const token = req.get('Authorization')
})

app.post('/api/users', (req, res) => { // signup
    const userSignupData = req.body
    if (!userSignupData.username || !userSignupData.password || !userSignupData.email || !userSignupData.fullname) {
        return res.status(400).send({error: 'need more info'})
    }

})

app.post('/api/sessions', (req, res) => { // login
    const token = jwt.sign({foo: 'bar'}, 'shhhh')
})

app.listen(3000)