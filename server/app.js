import express from 'express'
import fetch from 'node-fetch'

const app = express()
const port = 8000

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
