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


app.post('/auth', (req, res) => {
  res.json({message: 'Hello World'})
})

app.use(async (req, res, next) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  
  if (token) {
    req.token = token
    next()
  } else {
    res.status(401).json({message: 'Required token'})
  }
})

app.post('/register', (req, res) => {
  const {username, email} = req.body;
  connection.query(
    `INSERT INTO users (username, email, created_at) values (?, ?, ?)`,
    [username, email,  new Date()],
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

app.use(async (req, res, next) => {
  const auth = await fetch ('http://localhost:8800/auth', {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${req.token}`,
      'Content-Type': 'Application/json'
    }
  })

  const data = await auth.json()

  if (auth.ok) {
    req.auth = data
    next()
  } else {
    res.status(401).json(data)
  }
})

app.post('/post', (req, res) => {
  const {title, content} = req.body
  connection.query(
    `INSERT INTO posts (title, content, user_id, created_at) values (?, ?, ?, ?)`,
    [title, content, req.auth.applicationId, new Date()],
    (error, results) => {
      res.json(results)
    }
  )
})

app.get('/post', (req, res) => {
  connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id',
    (error, results) => {
      res.json(results)
    }
  )
})

// app.get('/post/:postId/comment', (req, res) => {
//   connection.query(
//     'INSERT INTO comments ()',
//     (error, results) => {
//       res.json(results)
//     })
// })


app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
