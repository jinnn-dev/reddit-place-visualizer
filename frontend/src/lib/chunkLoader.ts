// const BASE_CHUNK_PATH = '/bin/reddit_place_sorted_converted_struct';
const BASE_CHUNK_PATH = 'https://pdyn.de/place/reddit_place_sorted_converted_struct';

import axios from 'axios';

async function loadChunk(index: number, progressCallback: (percentage: number) => void): Promise<DataView> {
  if (index > 16) throw new Error('Chunk Index out of range');

  const res = await axios.get<ArrayBuffer>(`${BASE_CHUNK_PATH}${index}`, {
    responseType: 'arraybuffer',
    onDownloadProgress: (progress) => progressCallback(progress.loaded / progress.total)
  });

  // const res = await fetch(`${BASE_CHUNK_PATH}${index}`);

  // const buffer = await res.arrayBuffer();
  return new DataView(res.data);
}

function loadChunksHelper(
  index: number,
  processCallback: (view: DataView) => void,
  chunkProgressCallback: (percentage: number) => void
) {
  if (index == 17) return;
  loadChunk(index, chunkProgressCallback).then((view) => {
    processCallback(view);
    loadChunksHelper(index + 1, processCallback, chunkProgressCallback);
  });
}

export function loadAllChunks(
  processCallback: (view: DataView) => void,
  chunkProgressCallback: (percentage: number) => void
): void {
  loadChunksHelper(0, processCallback, chunkProgressCallback);
}
