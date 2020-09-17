const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/api', (req, res) => {
	res.json('success')
})

app.listen(3000, console.log('listening on port 3000'))