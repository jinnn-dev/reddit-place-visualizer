import express from 'express';
import { client } from './lib/redis'

const app = express()
const port = 3000


app.get('/dataBetweenTimestamps', async (req, res) => {
  const {start, stop} = req.body;

  const result = await client.zRange("pixels", start, stop);

  res.json(result)
})
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})