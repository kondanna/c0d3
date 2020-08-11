const express = require('express')
const app = express()
const session = require('express-session')
const  multer = require('multer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const { v4: uuid } = require('uuid')
const { notStrictEqual } = require('assert')
app.use(cors())
const bcrypt = require('bcrypt')

const upload = multer({dest: './public'}) // folder where uploads  go
app.post('/files', upload.array('keyname')) // forms used for uploading file requires key/value pair
app.use(express.static('./public')) // makes uploads available on website

let visitorCount = 0
let messages = []
fs.readFile('./messages.txt', (err, data) => {
    if (err) return console.log('error reading file')
    const str = data.toString()
    if (str) messages = JSON.parse(str)
})

const usersOnline = {}

app.use(session({
    secret: 'You-will-never-guess',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true}
}))

app.use(express.json({limit: '10mb'})) // for all with request body of type JSON

app.get(['/', '/hello'], (req, res) => {
    console.log(req.session.name)
    const ua = req.get('user-agent').toLowerCase()
    console.log(ua)
    if (ua.includes('mozilla/')) color = 'blue'
    if (ua.includes('chrome/')) color = 'red'
    res.send(`<h1 style="color:${color}">Hello world!</h1>`)
})

app.get('/ignore', (req, res) => {
    console.log('ouch', Date.now())
    res.set('Cache-Control', 'max-age=120')
    setTimeout(() => {
        res.send('<h1>Cached page</h1>')
    }, 3000)
})

app.get('/abtest', (req, res) => {
    const cookie = req.get('cookie') || ''
    const guid = parseCookie(cookie, 'guid')
    const abTest = parseCookie(cookie, 'abTest')
    res.send(`<h1 style="color:${abTest % 3 === 0 ? 'red' : 'blue'}">Hello World</h1>`)
})

app.get('/getfile', (req, res) => {
    // res.sendFile(path.join(__dirname, 'hello.txt'))
    fs.readFile('./hello.txt', (err, data) => {
        if (err) return res.status(500).send('Error reading file')
        res.send(`<p>File contents: ${data}</p>`)
    })
})

app.get('/uniques', (req, res) => {
    const cookie = req.get('cookie') || ''
    let guid = parseCookie(cookie, 'guid')
    if (guid) {
        res.send(`
            <h1>You have been identified with guid ${guid}</h1>
            <h3>Distinct Visitors Count: ${visitorCount}</h3>`)
    } else {
        guid = uuid()
        visitorCount++
        res.set({
            'set-cookie': `guid=${guid}`, // cookies must be key / value pair
            'set-cookie': `abTest=${visitorCount}`
        })
        res.send(`
            <h1>You have been ASSIGNED a guid ${guid}</h1>
            <h3>Distinct Visitors: ${visitorCount}</h3>`)
    }
})

app.get('/messages', (req, res) => {
    fs.readFile('./messages.txt', (err, data) => {
        if (err) return res.status(400).send('<h1>There are no messages</h1>')
        const parsedMessages = JSON.parse(data.toString())
        const messagesHTML = parsedMessages.reduce((acc, e) => {
            return `${acc}<p>${e}</p>`
        })
        res.send(`
            <h1>Here are your messages:</h1>
            <div>${messagesHTML}</div>
            <hr/>
            <textarea id="messageInput" cols="30" rows="10"></textarea>
            <button id="messageSubmit">Send Message</button>
            <script>
                messageSubmit.onclick = () => {
                    const messageInput = document.querySelector('#messageInput').value
                    fetch('http://localhost:3000/messages/add?message=' + messageInput)
                    messageInput.value = ''
                    alert('message sent. refreshing page to see your message')
                    window.location.reload()
                }
            </script>`)
    })
})

app.get('/messages/add', (req, res) => {
    const message = req.query.message 
    if (!message) return res.status(400).send('Please provide message query parameter.')
    messages.push(message)
    fs.writeFile('./messages.txt', JSON.stringify(messages), () => {})
    res.json(messages)
})

app.get('/online', (req, res) => {
    const user = req.query.name 
    if (!user) return res.status(400).send('Please provide user query parameter.')
    usersOnline[user] = Date.now()
    res.send(`
        <div>
            <h1>Welcome, ${user}</h1>
            <p>Open this page in another tab, using a different name!</p>
        </div>
        <div class="container"></div>
        <script>
            const render = (data) => {
                const $container = document.querySelector('.container')
                const otherUsersHTML = data.reduce((acc, name) => {
                    return acc + '<h3>' + name + '</h3>'
                }, '')
                if (otherUsersHTML) {
                    return $container.innerHTML = '<h2>Other Users</h2>' + otherUsersHTML
                }
                $container.innerHTML = ''
            }
            const refreshUsers = () => {
                fetch('http://localhost:3000/users?name=${user}')
                    .then(r => r.json())
                    .then(data => {
                        console.log('data', data)
                        render(data)
                        setTimeout(refreshUsers, 1000)
                    })
            }
            refreshUsers()
        </script>`)
})

app.get('/users', (req, res) => {
    const currentUser = req.query.name
    usersOnline[currentUser] = Date.now() 
    Object.keys(usersOnline).forEach(user => {
        if (Date.now() - usersOnline[user] > 5000) {
            delete usersOnline[user]
        }
    })
    const activeUsersMinusCurrentUser = Object.keys(usersOnline).filter(e => e !== currentUser)
    res.json(activeUsersMinusCurrentUser)
})

app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Allow-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Credentials' 
    )
    res.send('ok')
})

app.get('/delayed', (req, res) => {
    setTimeout(() => {
        res.send('<h1>welcome</h1>')
    }, +req.query.time )
})


// use = all methods will go through request handler function
app.use('/api/*', (req, res, next) => {// middleware to check for cookies on all paths that start with /api
    if (!req.get('cookie')) res.status(401).send('You are not authorized.')
    next()
})

app.put('/api/*', (req, res) => {
    res.send('<h1>PUT request received</h1>')
})

app.post('/api/*', (req, res) => {
    res.send('<h1>POST request received</h1>')
})

app.delete('/api/*', (req, res) => {
    res.send('ok')
})

const parseCookie = (cookieStr, cookieKey) => {
    const keyValuePair = cookieStr.split(';').find(str => str.includes(`${cookieKey}=`)) || ''
    return keyValuePair.split('=')[1] 
}

app.listen(3000)

// authentication
// send password via encryption and POST method 
// During signup / password reset:
bcrypt.hash( user_password, SALT_ROUNDS, (err, hashPw) => {
  // hashPw will be the encrypted password
  // The higher the salt level, the slower the encryption
})

// During login, when we want to compare the passwords
bcrypt.compare( user_password, hashPw, (err, result) => {
  // if passwords matches, result will be truthy
})
// when sending user data response back, remove password field from user
// delete user.password   