const pixelColors = [
  [109, 0, 26],
  [190, 0, 57],
  [255, 69, 0],
  [255, 168, 0],
  [255, 214, 53],
  [255, 248, 184],
  [0, 163, 104],
  [0, 204, 120],
  [126, 237, 86],
  [0, 117, 111],
  [0, 158, 170],
  [0, 204, 192],
  [36, 80, 164],
  [54, 144, 234],
  [81, 233, 244],
  [73, 58, 193],
  [106, 92, 255],
  [148, 179, 255],
  [129, 30, 159],
  [180, 74, 192],
  [228, 171, 255],
  [222, 16, 127],
  [255, 56, 129],
  [255, 153, 170],
  [109, 72, 47],
  [156, 105, 38],
  [255, 180, 112],
  [0, 0, 0],
  [81, 82, 82],
  [137, 141, 144],
  [212, 215, 127],
  [255, 255, 255]
];

class RenderLoop {
  DEFAULT_TICKS = 1000;
  MAX_TICKS = 10000;
  callback;
  currTime;
  ticks;
  isRunning;
  animationFrameId;
  frameProperties;

  constructor(renderCallback) {
    this.callback = renderCallback;
    this.currTime = 0;
    this.ticks = 1000;
    this.isRunning = false;
    this.frameProperties = {
      count: 0,
      start: performance.now(),
      last: performance.now(),
      time: 0,
      delta: 0
    };
    console.log(this.frameProperties);
  }

  start() {
    if (this.isRunning) return this;
    this.isRunning = true;

    this.frameProperties.start = performance.now();
    this.frameProperties.last = this.frameProperties.start;
    this.loop();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  togglePlay() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.resume();
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
    }
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
    }
  }

  loop() {

    this.frameProperties.time = performance.now();
    if (this.isRunning) {
      this.frameProperties.count++;
      this.frameProperties.delta = (this.frameProperties.time - this.frameProperties.last) * this.ticks;

      this.currTime += this.frameProperties.delta;
    }
    this.callback(this.currTime);

    this.frameProperties.last = this.frameProperties.time;
   
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  updateCurrTime(newTime) {
    this.currTime = newTime;
  }
}

class Renderer {

  renderLoop;
  numberOfCurrentVisibleChanges = 0;

  changedColorIndices;
  changedColorIndicesBackwards;
  changedCoordinates;
  colorGrid;

  imageData;

  constructor(changedColorIndices, changedColorIndicesBackwards, changedCoordinates, colorGrid, imageData) {
    this.changedColorIndices = changedColorIndices;
    this.changedColorIndicesBackwards = changedColorIndicesBackwards;
    this.changedCoordinates = changedCoordinates;
    this.colorGrid = colorGrid;
    this.imageData = imageData;
    this.renderLoop = new RenderLoop(this.render.bind(this));
    this.renderLoop.start();
  }

  renderCallback = (t) => {
    this.render(t);
  }

  render(t) {
    if (t < 0) {
      this.renderLoop.updateCurrTime(t);
    }



    const frames = Math.round(t - this.numberOfCurrentVisibleChanges);

    if (frames != 0) {
      const changes = frames > 0 ? this.changedColorIndices : this.changedColorIndicesBackwards;

      const step = frames / Math.abs(frames);
      const end = this.numberOfCurrentVisibleChanges + frames;

      for (let i = this.numberOfCurrentVisibleChanges; i !== end; i += step) {
        const coordinate = this.changedColorIndices[i];
        this.colorGrid[coordinate] = changes[i];
      }

      this.numberOfCurrentVisibleChanges = end;
    }

    const data = this.imageData.data;

    for (let i = 0; i < this.colorGrid.length; i++) {
      const pixel = i * 4;
      const color = pixelColors[this.colorGrid[i]];
      data[pixel] = color[0];
      data[pixel + 1] = color[1];
      data[pixel + 2] = color[2];

      data[pixel + 3] = 255;
    }



    postMessage({});
  }
}


onmessage = function (e) {


  const changedColorIndices = e.data.changedColorIndices;
  const changedColorIndicesBackwards = e.data.changedColorIndicesBackwards;
  const changedCoordinates = e.data.changedCoordinates;
  const colorGrid = e.data.colorGrid;
  const imageData = e.data.imageDataBuffer;
  const renderer = new Renderer(changedColorIndices, changedColorIndicesBackwards, changedCoordinates, colorGrid, imageData);

  
  // let numberOfLoadedChanges = 0;
  // const temporaryCanvas = new Uint8Array(e.data.width * e.data.height);
  // const changedColorIndices = new Uint8Array(e.data.numberOfChanges);
  // const changedCoordinates = new Uint32Array(e.data.numberOfChanges);
  // const changedColorIndicesBackwards = new Uint8Array(e.data.numberOfChanges);

  
  // loadAllChunks((view) => {
  //   let count = 0;

  //   for (let row = 0; row < view.byteLength; row += 5) {
  //     const x = view.getInt16(row, true);
  //     const y = view.getInt16(row + 2, true);
  //     const c = view.getInt8(row + 4);

  //     const p = x + y * e.data.width;

  //     const chunkOffset = count + e.data.numberOfLoadedChanges;

  //     changedColorIndices[chunkOffset] = c;
  //     changedCoordinates[chunkOffset] = p;
  //     changedColorIndicesBackwards[chunkOffset] = temporaryCanvas[p];
  //     temporaryCanvas[p] = c;
  //     count++;
  //   }
  //   numberOfLoadedChanges += count;

   

  //   postMessage([numberOfLoadedChanges, changedColorIndices, changedCoordinates, changedColorIndicesBackwards]);
  // });
};
