import express from 'express';
var cors = require('cors')

import { client } from './lib/redis'

const app = express()
const port = 5000
app.use(cors())

app.get('/dataBetweenTimestamps', async (req, res) => {
  const {start, stop} = req.query;
  console.log(`start: ${start}, stop: ${stop}`);
  const result = await client.zRange("pixels", start, stop);

  console.log(result)

  res.json(JSON.parse(result))
})
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
