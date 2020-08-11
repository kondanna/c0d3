const express = require('express')
const { exec } = require('child_process')
const cors = require ('cors')

const app = express()
app.use(express.json())
app.use(cors())

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

app.post('/api/commands', ({body: {command}}, res) => {
    console.log(command)
    exec(command, (err, stdout, stderr) => {
        console.log(command)
        if (err) console.log(err)
        console.log(stdout, stderr)
        res.json(stdout)
    })
})

app.get('/commands', (req, res) => {
    res.send(`
        <style>

        </style>
        <body>
            <h1>Commands</h1>
            <h3>Available commands: ls, cat, pwd</h3>
            <input type="text" class="commandInput">
            <hr>
            <div class="display"></div>
        </body>
        <script>
            const $commandInput = document.querySelector('.commandInput')
            const $display = document.querySelector('.display')
            $commandInput.onkeyup = (e) => {
                if (e.key === 'Enter') {
                    const command = $commandInput.value
                    const firstKeyword = command.split(' ')[0] 
                    if (firstKeyword === 'cat' || firstKeyword === 'ls' || firstKeyword === 'pwd') {
                        fetch('http://localhost:3000/api/commands', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ command })
                        }).then(r => r.json()).then(data => {
                            $display.innerText = data
                            $commandInput.value = ''
                        })
                    }
                }
            }
        </script>
    `)
})

app.listen(3000)