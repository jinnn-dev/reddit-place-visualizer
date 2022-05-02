import express from 'express';
var cors = require('cors')

import { client } from './lib/redis'

const app = express()
const port = 5000
app.use(cors())

type BetweenTimestampsQuery = {
  start: number, 
  stop:number
}


app.get<{}, any, any, BetweenTimestampsQuery>('/dataBetweenTimestamps', async (req, res) => {
  const {start, stop} = req.query;

  if(!start || !stop) {
    return res.status(400).send("no start or stop params defined")
  }

  console.log(`start: ${start}, stop: ${stop}`);
  const response = await client.zRangeByScore("pixels", start, stop);

  const parsed = response.map(e => JSON.parse(e));

  res.json(parsed)
})
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
