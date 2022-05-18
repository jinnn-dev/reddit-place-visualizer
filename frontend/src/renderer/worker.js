import { loadAllChunks } from '../lib/chunkLoader';

onmessage = function (e) {
  console.log(e.data);
  console.log(JSON.parse(e[0]));
};
