import axios from 'axios';
import { rendererState } from '@/renderer/rendererState';
// const BASE_CHUNK_PATH = '/bin/reddit_place_sorted_converted_struct';
const BASE_CHUNK_PATH = 'https://pdyn.de/place/reddit_place_sorted_converted_struct';
export const NUMBER_OF_CHUNKS = 16;

async function loadChunk(index: number, progressCallback: (percentage: number) => void): Promise<DataView> {
  if (index > NUMBER_OF_CHUNKS) throw new Error('Chunk Index out of range');

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
  if (index > NUMBER_OF_CHUNKS) return;
  loadChunk(index, chunkProgressCallback).then((view) => {
    processCallback(view);
    rendererState.loadedChunks++;
    loadChunksHelper(index + 1, processCallback, chunkProgressCallback);
  });
}

export function loadAllChunks(
  processCallback: (view: DataView) => void,
  chunkProgressCallback: (percentage: number) => void
): void {
  rendererState.loadedChunks = 0;
  loadChunksHelper(0, processCallback, chunkProgressCallback);
}
