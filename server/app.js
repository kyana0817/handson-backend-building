import express from 'express'
import cors from 'cors'

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

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
