const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => { 
    console.log(`a user connected with socket.id ${socket.id}`) 

    socket.on('chat message', (msg) => {
        console.log(`used with socket ID ${socket.id} says: ${msg}`)
    })

    socket.on('disconnect', () => {
        console.log(`user with socket.id ${socket.id} disconnected`)
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000');
})