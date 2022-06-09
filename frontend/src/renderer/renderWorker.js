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
    this.ticks = this.DEFAULT_TICKS;
    this.isRunning = false;
    this.frameProperties = {
      count: 0,
      start: performance.now(),
      last: performance.now(),
      time: 0,
      delta: 0
    };
  }

  start() {
    if (this.isRunning) return this;
    this.isRunning = false;

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

  reset() {
    this.pause();
    this.currTime = 0;
    this.frameProperties = {
      count: 0,
      start: performance.now(),
      last: performance.now(),
      time: 0,
      delta: 0
    };
  }

  loop() {
    if (this.isRunning) {
      this.frameProperties.time = performance.now();
      this.frameProperties.count++;
      this.frameProperties.delta = (this.frameProperties.time - this.frameProperties.last) * this.ticks;
      this.currTime += this.frameProperties.delta;
    } else {
      this.frameProperties.last = performance.now();
    }
    this.callback(this.currTime);

    if (this.isRunning) {
      this.frameProperties.last = this.frameProperties.time;
    }

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  updateCurrTime(newTime) {
    this.currTime = newTime;
  }
}

class Renderer {
  canvas;
  context;

  renderLoop;
  numberOfCurrentVisibleChanges = 0;
  numberOfLoadedChanges = 100000;

  changedColorIndices;
  changedColorIndicesBackwards;
  changedCoordinates;
  temporaryCanvasState;
  pixelLifespans;

  colorCounts;
  selectedColors;
  selectedHeatMap;

  colorGrid;

  imageData;

  NUMBER_OF_CHANGES = 160353105;
  DEFAULT_BACKGROUND_COLOR_INDEX = 12;

  renderMode;
  pixelLifespan;
  scale = 1;

  constructor(
    canvas,
    changedColorIndices,
    changedColorIndicesBackwards,
    changedCoordinates,
    colorGrid,
    colorCounts,
    selectedColors,
    selectedHeatMap
  ) {
    this.canvas = canvas;
    this.changedColorIndices = changedColorIndices;
    this.changedColorIndicesBackwards = changedColorIndicesBackwards;
    this.changedCoordinates = changedCoordinates;
    this.colorGrid = colorGrid;
    this.colorCounts = colorCounts;
    this.selectedColors = selectedColors;
    this.selectedHeatMap = selectedHeatMap;

    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.imageData.data.fill(255);

    this.pixelLifespans = new Uint8Array(this.canvas.width * this.canvas.height).fill(0);

    this.renderLoop = new RenderLoop(this.render.bind(this));
    this.renderLoop.start();
  }

  renderCallback = (t) => {
    this.render(t);
  };

  reset() {
    this.colorGrid.fill(255);
    this.colorCounts.fill(0);
    this.pixelLifespans.fill(0);
    this.renderLoop.reset();
    this.imageData.data.fill(0);
    this.context.putImageData(this.imageData, 0, 0);
  }

  render(t) {
    const percentageFallOf = 9 / (this.pixelLifespan * this.pixelLifespan);
    if (t === 0) {
      postMessage({
        update: 0
      });
      return;
    }
    if (t < 0) {
      t = 0;
      this.colorGrid.fill(255);
      this.colorCounts.fill(0);
      this.renderLoop.updateCurrTime(t);
      for (let i = 0; i < this.colorGrid.length; i++) {
        if (this.pixelLifespans[i] > 0) {
          this.pixelLifespans[i] = this.pixelLifespans[i] - percentageFallOf;
        }
      }
    }

    if (t >= 160353105 - 1) {
      t = 160353105 - 1;
      this.renderLoop.updateCurrTime(160353105 - 1);
      this.colorGrid.fill(31);
      this.colorCounts.fill(0);
      this.colorCounts[31] = 4e6;
      for (let i = 0; i < this.colorGrid.length; i++) {
        if (this.pixelLifespans[i] > 0) {
          this.pixelLifespans[i] = this.pixelLifespans[i] - percentageFallOf;
        }
      }
    }

    if (t > this.numberOfLoadedChanges - 1 && t < 160353105) {
      t = this.numberOfLoadedChanges - 1;
      this.renderLoop.updateCurrTime(this.numberOfLoadedChanges - 1);

      for (let i = 0; i < this.colorGrid.length; i++) {
        if (this.pixelLifespans[i] > 0) {
          this.pixelLifespans[i] = this.pixelLifespans[i] - percentageFallOf;
        }
      }
    }

    const frames = Math.round(t - this.numberOfCurrentVisibleChanges);

    if (frames !== 0) {
      const changes = frames > 0 ? this.changedColorIndices : this.changedColorIndicesBackwards;

      const step = frames / Math.abs(frames);
      const end = this.numberOfCurrentVisibleChanges + frames;

      for (let i = this.numberOfCurrentVisibleChanges; i !== end; i += step) {
        const coordinate = this.changedCoordinates[i];
        const colorIndex = this.colorCounts[this.colorGrid[coordinate]];
        if (colorIndex >= 1) {
          this.colorCounts[this.colorGrid[coordinate]]--;
        }
        this.colorGrid[coordinate] = changes[i];
        this.colorCounts[this.colorGrid[coordinate]]++;
        this.pixelLifespans[coordinate] = this.pixelLifespan;
      }
      this.numberOfCurrentVisibleChanges = end;

      // const counts = {};
      // for (const num of this.colorGrid) {
      //   counts[num] = counts[num] ? counts[num] + 1 : 1;
      // }
      //
      // console.log(
      //   counts,
      //   Object.values(counts).reduce((partialSum, a) => partialSum + a, 0)
      // );
    }

    const data = this.imageData.data;

    for (let i = 0; i < this.colorGrid.length; i++) {
      if (this.pixelLifespans[i] > this.pixelLifespan) {
        this.pixelLifespans[i] = this.pixelLifespan;
      }

      const pixel = i * 4;
      let color;

      if (this.renderMode === 0) {
        if (this.selectedColors[this.colorGrid[i]] === 1) {
          color = pixelColors[this.colorGrid[i]];
        } else {
          color = [0, 0, 0];
        }
      } else {
        color = heatMapColorMaps[this.selectedHeatMap[0]][~~((this.pixelLifespans[i] / this.pixelLifespan) * 9)];
      }

      data[pixel] = color[0];
      data[pixel + 1] = color[1];
      data[pixel + 2] = color[2];
      data[pixel + 3] = 255;

      if (frames !== 0) {
        if (this.pixelLifespans[i] > 0) {
          this.pixelLifespans[i]--;
        }
      }
    }
    this.context.putImageData(this.imageData, 0, 0);
    postMessage({
      update: t
    });
  }
}

let renderer;

onmessage = function (e) {
  if (e.data.render !== undefined) {
    const data = e.data.render;
    const canvas = data.canvas;

    const changedColorIndices = new Uint8Array(data.changedColorIndices);
    const changedColorIndicesBackwards = new Uint8Array(data.changedColorIndicesBackwards);
    const changedCoordinates = new Uint32Array(data.changedCoordinates);
    const colorGrid = new Uint8Array(canvas.width * canvas.height).fill(255);

    const colorCounts = new Uint32Array(data.colorCounts);
    const selectedColors = new Uint8Array(data.selectedColors);
    const selectedHeatMap = new Uint8Array(data.selectedHeatMap);
    renderer = new Renderer(
      canvas,
      changedColorIndices,
      changedColorIndicesBackwards,
      changedCoordinates,
      colorGrid,
      colorCounts,
      selectedColors,
      selectedHeatMap
    );
  }

  if (e.data.renderMode !== undefined) {
    renderer.renderMode = e.data.renderMode;
  }

  if (e.data.pixelLifespan !== undefined) {
    renderer.pixelLifespan = e.data.pixelLifespan;
  }

  if (e.data.numberOfLoadedChanges) {
    renderer.numberOfLoadedChanges = e.data.numberOfLoadedChanges;
  }

  if (e.data.togglePlay) {
    renderer.renderLoop.togglePlay();
  }

  if (e.data.rateTimeline) {
    renderer.renderLoop.ticks = e.data.rateTimeline;
  }

  if (e.data.timeTimeline) {
    renderer.renderLoop.updateCurrTime(e.data.timeTimeline);
  }

  if (e.data.start) {
    renderer.renderLoop.start();
  }

  if (e.data.stop) {
    renderer.renderLoop.stop();
  }

  if (e.data.reset) {
    renderer.reset();
  }
};

let pixelColors = [
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

let rainbow = [
  [0, 0, 0],
  [94, 79, 162],
  [50, 136, 189],
  [102, 194, 165],
  [171, 221, 164],
  [230, 245, 152],
  [254, 224, 139],
  [253, 174, 97],
  [244, 109, 67],
  [213, 62, 79]
];

let redToGreenToBlue = [
  [0, 0, 0],
  [0, 0, 255],
  [0, 0, 255],
  [0, 0, 255],

  [0, 255, 0],
  [0, 255, 0],
  [0, 255, 0],

  [255, 0, 0],
  [255, 0, 0],
  [255, 0, 0]
];

let redToGreen = [
  [0, 0, 0],
  [255, 56, 0],
  [255, 107, 0],
  [255, 158, 0],
  [255, 209, 0],
  [250, 255, 0],
  [199, 255, 0],
  [148, 255, 0],
  [97, 255, 0],
  [46, 255, 0]
];

let redGradient = [
  [0, 0, 0],
  [37, 0, 0],
  [64, 0, 0],
  [91, 0, 0],
  [118, 0, 0],
  [145, 0, 0],
  [172, 0, 0],
  [199, 0, 0],
  [227, 0, 0],
  [255, 0, 0]
];

let fire = [
  [0, 0, 0],
  [91, 0, 0],
  [91, 0, 0],
  [91, 0, 0],
  [145, 0, 0],
  [145, 0, 0],
  [145, 0, 0],
  [255, 191, 31],
  [255, 191, 31],
  [255, 191, 31]
];
let heatMapColorMaps = [rainbow, redToGreenToBlue, redToGreen, redGradient, fire];
