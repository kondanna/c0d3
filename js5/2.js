const express = require('express')
const { exec } = require('child_process')
const app = express()
app.use(express.json())

app.post('/api/commands', ({body: {command}}, res) => {
    const forbiddenCommands = ['sudo', 'rm', 'mkdir', 'touch', 'nano']
    let forbiddenInput = false
    forbiddenCommands.some(cmd => { 
        if (command.includes(cmd)) {
            forbiddenInput = true
            return true
        } 
    }) // Array.some breaks from loop anytime it returns true
    if (forbiddenInput) return res.json('You entered an invalid command.')
    exec(command, (err, stdout, _stderr) => {
        if (err) console.log(err)
        return res.json(stdout)
    })
})

app.get('/commands', (req, res) => {
    res.send(`
        <div>
            <h1>Commands</h1>
            <h3>Available commands: ls, cat, pwd</h3>
            <input type="text" class="commandInput">
            <hr>
            <div class="display"></div>
        </div>
        <script>
            const $commandInput = document.querySelector('.commandInput')
            const $display = document.querySelector('.display')
            $commandInput.onkeyup = (e) => {
                if (e.key === 'Enter') {
                    fetch('http://localhost:3000/api/commands', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ command: $commandInput.value })
                    }).then(r => r.json()).then(data => {
                        $display.innerText = data
                        $commandInput.value = ''
                    })
                }
            }
        </script>`)
})

app.listen(3000)