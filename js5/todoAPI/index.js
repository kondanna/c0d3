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
app.use(cors())

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
    todos.push({id: todoId, text: todo.text, completed: todo.completed})
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(201).send(todoId)
})

app.put('/api/todos/:id', (req, res) => {
    const todoId = req.params.id 
    console.log(req.params.id)
    const newTodo = req.body
    todos.map(todo => {
        if (todo.id === todoId) return newTodo 
    })
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(204).send()
})

app.patch('/api/todos/:id', (req, res) => {
    const todoId = req.params.id 
    const updatedTodo = req.body
    todos.forEach(todo => {
        if (todo.id === todoId) {
            if (req.body.completed) todo.completed = updatedTodo.completed 
            if (req.body.text) todo.text = updatedTodo.text
        }
    })
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(204).send()
})

app.delete('/api/todos/:id', (req, res) => {
    const todoId = req.params.id 
    todos = todos.filter(todo => todo.id !== todoId)
    fs.writeFile('./todos.txt', JSON.stringify(todos), () => { console.log('updated todos.txt')})
    res.status(204).send(todoId)
})

app.listen(3000, () => {
    console.log('starting server on http://localhost:3000')
})