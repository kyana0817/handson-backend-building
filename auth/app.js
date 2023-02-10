import express from 'express'
import cors from 'cors'
import {
  jwtIssue,
  refreshTokenIssue,
  verify
} from './jwt.js'
import { 
  registerUser,
  refreshTokenSet,
  userExist,
  fetchUser
} from './inMemory.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  const msg = jwtIssue({email: 'example@example.com'})
  res.send(msg)
  registerUser({email: 'example@example.com', password: 'pass1234'})
})

app.post('/register', (req, res) => {
  registerUser(req.body)
  const token = jwtIssue(req.body)
  const refreshToken = refreshTokenIssue(req.body)
  refreshTokenSet(req.body, refreshToken)

  res.json({token, refreshToken})
})

app.post('/login', (req, res) => {
  if (userExist(req.body)) {
    const token = jwtIssue(req.body)
    const refreshToken = refreshTokenIssue(req.body)
    refreshTokenSet(req.body, refreshToken)
  
    res.json({token, refreshToken})
  } else {
    res.json({message: 'oops'})
  }
})

app.get('/auth', async (req, res) => {
  const token = req.header('Authorization')?.replace(/^Bearer/, '')
  const [verified, data] = verify(token)

  if (verified) {
    const {password, ...user} = await fetchUser(data.sub)
    res.json(user)
  } else {
    res.json(data)
  }
})

app.listen(8800)
