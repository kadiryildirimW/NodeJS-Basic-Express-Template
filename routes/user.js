const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user')

const privateKey = process.env.PRIVATE_KEY
const sessionDuration = process.env.SESSION_DURATION

router.get('/user/login', (req, res) => {
  res.render('login')
})

router.get('/user/register', (req, res) => {
  res.render('register')
})

router.get('/user/session', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.sendStatus(400)
    const { id } = jwt.verify(token, privateKey)
    const user = await User.findById(id)
    if (user) {
      res.send(user)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.sendStatus(400)
    } else if (err.name === 'TokenExpiredError') {
      res.sendStatus(408)
    } else {
      res.sendStatus(500)
    }
    console.error(err)
  }
})

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: sessionDuration })
        res.send({ token })
      } else {
        res.sendStatus(401)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error(err)
  }
})

router.post('/user/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    if (await User.findOne({ email })) {
      res.sendStatus(409)
    } else {
      const { id } = await User.create({ email, password: hashedPassword })
      const token = jwt.sign({ id }, privateKey, { expiresIn: sessionDuration })
      res.send({ token })
    }
  } 
  catch (err) {
    console.error(err)
  }
})

module.exports = router
