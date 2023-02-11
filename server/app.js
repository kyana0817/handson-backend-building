import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import fetch from 'node-fetch'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'example'
})


const app = express()
const port = 8000


app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/auth', (req, res) => {
  console.log(req.body)
  res.json({message: 'Hello World'})
})

app.use(async (req, res, next) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')

  if (token) {
    req.token = token
    next()
  } else {
    res.status(400).json({message: 'Required token'})
  }
})

app.post('/register', (req, res) => {
  const {username, email} = req.body;
  connection.query(
    `INSERT INTO users (username, email) values (?, ?)`,
    [username, email],
    async (error, results) => {
      const auth = await (await fetch ('http://localhost:8800/auth/update', {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${req.token}`,
          'Content-Type': 'Application/json'
        },
        body: JSON.stringify({applicationId: results.insertId})
      })).json()
      res.json(auth)
    }
  )
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
