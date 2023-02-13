import express from 'express'
import cors from 'cors'
import _ from 'lodash'

import {
  jwtIssue,
  refreshTokenIssue,
  verify
} from './jwt.js'
import { 
  registerUser,
  setRefreshToken,
  userExist,
  fetchUser,
  authenticate,
  setUserAttributes
} from './inMemory.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  const msg = jwtIssue({email: 'example@example.com'})
  res.send(msg)
  registerUser({email: 'example@example.com', password: 'pass1234'})
})

app.post('/register', async (req, res) => {
  if (await userExist(req.body)) {
    res.status(401).json({message: 'already exists'})
  } else {
    registerUser(req.body)
    const accessToken = jwtIssue(req.body)
    const refreshToken = refreshTokenIssue(req.body)
    console.log(refreshToken)
    setRefreshToken(req.body, refreshToken)
  
    res.json({accessToken, refreshToken})
  }
})

app.post('/login', (req, res) => {
  if (authenticate(req.body)) {
    const accessToken = jwtIssue(req.body)
    const refreshToken = refreshTokenIssue(req.body)
    setRefreshToken(req.body, refreshToken)
  
    res.json({accessToken, refreshToken})
  } else {
    res.json({message: 'oops'})
  }
})

app.use(async (req, res, next) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  const [verified, data] = verify(token)
  const {password, ...auth} = await fetchUser(data?.sub)

  if (verified) {
    if (_.isEmpty(auth)) {
      res.status(401).json({message: 'unknown user'})
    } else {
      req.auth = { ...data, ...auth }
      next()
    }
  } else {
    res.status(401).json(data)
  }
})

app.get('/auth', async (req, res) => {
  res.json(req.auth)
})

app.post('/auth/update', async (req, res) => {
  setUserAttributes(req.auth, req.body)
  res.json({result: true})
})

app.get('/state', (req, res) => {
  res.json({state: true})
})

app.listen(8800)
