const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let usersOnline = {} // {<room>: {{<socketID>: <nickname>}, ...}, ...}
let messages = {} // {<room>: [{<nickname>: <message>}, ...], ...}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', socket => {
    socket.on('sign in', data => {
        const { room, nickname } = data
        socket.room = room
        socket.nickname = nickname

        usersOnline[room] = usersOnline[room] || {}
        usersOnline[room][socket.id] = nickname 
        messages[room] = messages[room] || []

        socket.emit('load users', usersOnline[room])
        socket.emit('load messages', messages[room])

        socket.broadcast.emit('user connected', { room, nickname, id: socket.id })
        const welcomeMessage = { room, nickname: room, message: `${nickname} has joined the chat.` }
        io.emit('receive message', welcomeMessage)
        messages[room].push(welcomeMessage)
    })

    socket.on('typing', data => {
        const { room, nickname } = data
        socket.broadcast.emit('typing', { room, nickname })
    })

    socket.on('new message', data => {
        const { room, nickname, message } = data
        messages[room] = messages[room] || []
        messages[room].push({ nickname, message })
        io.emit('receive message', { room, nickname, message })
    })

    socket.on('disconnect', () => {
        const { id, room, nickname } = socket

        const goodbyeMessage = { room, nickname: room, message: `${nickname} has left the chat.` }
        socket.broadcast.emit('receive message', goodbyeMessage)
        messages[room].push(goodbyeMessage)

        delete usersOnline[room][id] // usersOnline[room][id] = null
        socket.broadcast.emit('user disconnected', id)
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000');
})