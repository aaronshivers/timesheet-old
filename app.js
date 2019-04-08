const express = require('express')
const compression = require('compression')

const app = express()
const port = process.env.PORT || 3000

app.use(compression())
app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))

app.listen(port)
