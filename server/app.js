import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

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

app.post('/register', (req, res) => {

})

app.get('/test', (req, res) => {
  connection.query('SELECT 42;', (err, results) => {
    res.send(results)
  })
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
