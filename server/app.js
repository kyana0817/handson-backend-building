import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import fetch from 'node-fetch'

const connection = await mysql.createConnection({
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

app.post('/register', async (req, res) => {
  const {username, email} = req.body;
  
  const [result, meta] = await connection.query(
    'INSERT INTO users (username, email, created_at) values (?, ?, ?)',
    [username, email,  new Date()]
  )
  
  const auth = await (await fetch ('http://localhost:8800/auth/update', {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${req.token}`,
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({applicationId: result.insertId})
  })).json()

  res.json(auth)
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

app.get('/post', async (req, res) => {
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id',
  )

  res.json(posts)
})

app.post('/post', async (req, res) => {
  const {title, content} = req.body

  const [result, meta] = await connection.query(
    `INSERT INTO posts (title, content, user_id, created_at) values (?, ?, ?, ?)`,
    [title, content, req.auth.applicationId, new Date()]
  )

  res.json({id: result.insertId})
})

app.get('/post/:postId/comment', async (req, res) => {
  const { postId } = req.params

  const [comments, meta] = await connection.query(
    'SELECT u.username, c.content FROM comments as c JOIN users as u ON c.user_id = u.id WHERE c.post_id = ?',
    [postId]
  )
  res.json(comments)
})
  
app.post('/post/:postId/comment', async (req, res) => {
  const { content } = req.body
  const { postId } = req.params

  const [result, meta] = await connection.query(
    'INSERT INTO comments (post_id, user_id, content, created_at) values (?, ?, ?, ?)',
    [postId, req.auth.applicationId, content, new Date()]    
  )

  res.json({id: result.insertId})
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
