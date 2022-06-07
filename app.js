const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

if (!process.env.DISTRIBUTION) {
  require('dotenv').config()
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('public'))
app.set('view engine', 'pug')

require('./mongodb-connection')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')

app.use(indexRouter)
app.use(userRouter)

module.exports = app
