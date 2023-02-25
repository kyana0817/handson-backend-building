import express from 'express'
import fetch from 'node-fetch'
import mysql from 'mysql2/promise'
import cors from 'cors'

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
  const payload = req.body
  
  const [result, meta] = await connection.query(
    'INSERT INTO users (username, email, created_at) values (?, ?, ?)',
    [payload.username, payload.email,  new Date()]
  )
    
  const response = await fetch('http://localhost:8800/auth/update', {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${req.token}`,
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({applicationId: result.insertId})
  })
  
  const auth = await response.json()
  
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

app.post('/post', async (req, res) => {
  const payload = req.body
  
  const [result, meta] = await connection.query(
    `INSERT INTO posts (title, content, user_id, created_at) values (?, ?, ?, ?)`,
    [payload.title, payload.content, req.auth.applicationId, new Date()]
  )
    
  res.json({id: result.insertId})
})

app.get('/post', async (req, res) => {
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id',
  )
    
  res.json(posts)
})
    
app.post('/post/:postId/comment', async (req, res) => {
  const params = req.params
  const payload = req.body
  const auth = req.auth
  
  const [result, meta] = await connection.query(
    'INSERT INTO comments (post_id, user_id, content, created_at) value (?, ?, ?, ?)',
    [params.postId, auth.applicationId, payload.content, new Date()]
  )
  
  res.json({id: result.insertId})
})
      
app.get('/post/:postId/comment', async (req, res) => {
  const params = req.params
  
  const [comments, meta] = await connection.query(
    'SELECT u.username, c.content FROM comments as c JOIN users as u ON c.user_id = u.id WHERE c.post_id = ?',
    [params.postId]
  )
  
  res.json(comments)
})

        
app.get('/user/:userId', async (req, res) => {
  const auth = req.auth
  const params = req.params
  
  const [users, meta] = await connection.query([
      'SELECT u.username, u.email, COUNT(s.source_id) as source, COUNT(t.target_id) as target,',
      '(CASE WHEN COUNT(t.source_id = ?) = 1 THEN 1 ELSE 0 END) as is_follow',
      'FROM users as u',
      'LEFT JOIN followers as s ON u.id = s.source_id',
      'LEFT JOIN followers as t ON u.id = t.target_id',
      'WHERE u.id = ?',
      'GROUP BY u.id'
    ].join(' '),
    [auth.applicationId, params.userId]
  )
  
  res.json(users[0])
})




app.get('/user/:userId/post', async (req, res) => {
  const {userId} = req.params
  
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id where u.id = ?',
    [userId]
  )
    
  res.json(posts)
})


app.post('/follow/:userId', async (req, res) => {
  const auth = req.auth
  const params = req.params

  const [result, meta] = await connection.query(
    'INSERT INTO followers (source_id, target_id, created_at) values (?, ?, ?)',
    [auth.applicationId, params.userId, new Date()]
  )

  res.json({id: result.insertId})
})


app.delete('/follow/:userId', async (req, res) => {
  const auth = req.auth
  const params = req.params

  const [result, meta] = await connection.query(
    'DELETE FROM followers WHERE source_id = ? AND target_id = ?',
    [auth.applicationId, params.userId]
  )

  res.json(result)
})

app.get('/currentUser', async (req, res) => {
  const auth = req.auth

  const [users, meta] = await connection.query([
      'SELECT u.username, u.email, COUNT(s.source_id) as source, COUNT(t.target_id) as target',
      'from users as u',
      'LEFT JOIN followers as s ON u.id = s.source_id',
      'LEFT JOIN followers as t ON u.id = t.target_id',
      'WHERE u.id = ?',
      'GROUP BY u.id'
    ].join(' '),
    [auth.applicationId]
  )

  res.json(users[0])
})

app.get('/currentUser/post', async (req, res) => {
  const auth = req.auth
  
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id where u.id = ?',
    [auth.applicationId]
  )

  res.json(posts)
})
        
app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
