import express from 'express'
import cors from 'cors'
import _ from 'lodash'

import {
  checkSignature,
  jwtIssue,
  parsePayload,
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
    const refreshToken = refreshTokenIssue()
    setRefreshToken(req.body, refreshToken)
  
    res.json({accessToken, refreshToken})
  }
})

app.post('/login', async (req, res) => {
  if (await authenticate(req.body)) {
    const accessToken = jwtIssue(req.body)
    const refreshToken = refreshTokenIssue()
    setRefreshToken(req.body, refreshToken)
  
    res.json({accessToken, refreshToken})
  } else {
    res.status(401).json({message: 'unknown user'})
  }
})


app.post('/refresh', async (req, res) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  const { refreshToken } = req.body
  
  if ( checkSignature(token) ) {
    const payload = parsePayload(token)
    const {password, ...auth} = await fetchUser(payload?.sub)
    
    if ( auth.refreshToken === refreshToken ) {
      const accessToken = jwtIssue({...req.body, email: payload.sub})
      const refreshToken = refreshTokenIssue()
      setRefreshToken({email: payload.sub}, refreshToken)
      
      res.json({accessToken, refreshToken})
      
    } else {
      res.status(401).json({message: 'unknown user'})

    }
  } else {
    res.status(401).json({message: 'bad token'})
    
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
