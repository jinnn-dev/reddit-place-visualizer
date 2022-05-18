import { loadAllChunks } from '../lib/chunkLoader';

onmessage = function (e) {
  let numberOfLoadedChanges = 0;
  const temporaryCanvas = new Uint8Array(e.data.width * e.data.height);
  const changedColorIndices = new Uint8Array(e.data.numberOfChanges);
  const changedCoordinates = new Uint32Array(e.data.numberOfChanges);
  const changedColorIndicesBackwards = new Uint8Array(e.data.numberOfChanges);
  loadAllChunks((view) => {
    let count = 0;

    for (let row = 0; row < view.byteLength; row += 5) {
      const x = view.getInt16(row, true);
      const y = view.getInt16(row + 2, true);
      const c = view.getInt8(row + 4);

      const p = x + y * e.data.width;

      const chunkOffset = count + e.data.numberOfLoadedChanges;

      changedColorIndices[chunkOffset] = c;
      changedCoordinates[chunkOffset] = p;
      changedColorIndicesBackwards[chunkOffset] = temporaryCanvas[p];
      temporaryCanvas[p] = c;
      count++;
    }
    numberOfLoadedChanges += count;

    postMessage([numberOfLoadedChanges, changedColorIndices, changedCoordinates, changedColorIndicesBackwards]);
  });
};
