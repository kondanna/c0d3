const express = require('express')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const cors = require('cors')
const { Pool } = require('pg') // node-postgresql

const pool = new Pool({
    host: 'localhost', 
    user: 'cko', 
    password: 'offsprin'
})

// sudo service postgresql restart
// sudo su postgres
// psql
// CREATE DATABASE api;
// \list
// \c api
// CREATE TABLE todos (ID SERIAL PRIMARY KEY, text VARCHAR(180));
// INSERT INTO todos ('123123', 'do thing one'), ('234234', 'do thing two');
// SELECT * FROM todos;

let todos = []
fs.readFile('./todos.txt', (err, data) => {
    if (err) return console.log('no data')
    todos = JSON.parse(data)
})

const app = express()
app.use(express.json())
app.use(express.static('public'))
app.use(cors({
    credentials: true
}))

app.options('/api/todos/*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', 'req.headers.origin') // req.headers.origin
    res.header('Allow-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Credentials' 
    )
    res.send('ok')
})

app.get('/api/todos', (req, res) => {
    res.json(JSON.stringify(todos))
})

app.get('/api/todos/:id', (req, res) => {
    const todoId = req.params.id
    const todo = todos.filter(todo => todo.id === todoId)
    res.json(todo)
})

app.post('/api/todos', (req, res) => {
    const todo = req.body
    const todoId = uuid()
    todos.unshift({id: todoId, text: todo.text, completed: false})
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(201).json(todoId)
})

app.put('/api/todos/:id', (req, res) => {
    todos.map(todo => {
        if (todo.id === req.params.id) return req.body 
    })
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(204).json()
})

app.patch('/api/todos/:id', (req, res) => {
    console.log(req.body)
    todos.forEach(todo => {
        if (todo.id === req.params.id) {
            if (req.body.hasOwnProperty('completed')) todo.completed = req.body.completed 
            if (req.body.hasOwnProperty('text')) todo.text = req.body.text
        }
    })
    console.log(todos)
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(204).json()
})

app.delete('/api/todos/:id', (req, res) => {
    todos = todos.filter(todo => todo.id !== req.params.id )
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(204).json(todoId)
})

app.listen(3000, () => {
    console.log('starting server on http://localhost:3000')
})