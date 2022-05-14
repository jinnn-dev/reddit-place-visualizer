// const BASE_CHUNK_PATH = "/bin/reddit_place_sorted_converted_struct"
const BASE_CHUNK_PATH =
  'https://pdyn.de/place/reddit_place_sorted_converted_struct';

async function loadChunk(index: number): Promise<DataView> {
  if (index > 16) throw new Error('Chunk Index out of range');
  const res = await fetch(`${BASE_CHUNK_PATH}${index}`);
  if (!res.ok) throw new Error(res.statusText);
  const buffer = await res.arrayBuffer();
  return new DataView(buffer);
}

function loadChunksHelper(
  index: number,
  processCallback: (view: DataView) => void
) {
  if (index == 17) return;
  loadChunk(index).then((view) => {
    processCallback(view);
    loadChunksHelper(index + 1, processCallback);
  });
}

export function loadAllChunks(processCallback: (view: DataView) => void): void {
  loadChunksHelper(0, processCallback);
}
