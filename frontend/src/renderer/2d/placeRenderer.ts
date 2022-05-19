import { CanvasRenderer } from '@/renderer/2d/canvasRenderer';
import { Timeline } from '@/components/timeline';
import { RenderLoop } from '@/renderer/renderLoop';
import { loadAllChunks } from '@/lib/chunkLoader';

import ChunkWorker from '../worker?worker';
import { heatMapColorMaps, pixelColors } from '@/model/colorMapping';
import { rendererState } from '@/renderer/rendererState';

export class PlaceRenderer extends CanvasRenderer {
  public static NUMBER_OF_CHANGES = 160353105;
  public static DEFAULT_BACKGROUND_COLOR_INDEX = 27;
  public static DEFAULT_PIXEL_LIFESPAN = 5;

  colorGrid!: Uint8Array;

  changedCoordinates!: Uint32Array;
  changedColorIndices!: Uint8Array;
  changedColorIndicesBackwards!: Uint8Array;
  pixelLifespans!: Uint8Array;

  temporaryCanvasState!: Uint8Array;

  numberOfLoadedChanges: number = 0;
  numberOfCurrentVisibleChanges: number = 0;

  pixelLifespan: number = PlaceRenderer.DEFAULT_PIXEL_LIFESPAN;

  timeTimeline: Timeline;
  rateTimeline: Timeline;

  renderMode: number = 0;
  selectedColorMap: number = 0;
  selectedColorIndices: boolean[];

  constructor(element: HTMLCanvasElement) {
    super(element);

    this.initializeArrays();

    this.timeTimeline = new Timeline('time');

    this.rateTimeline = new Timeline('rate');
    const percentage = (0.5 + (RenderLoop.DEFAULT_TICKS / RenderLoop.MAX_TICKS) * 0.5) * 100;
    this.rateTimeline.updateThumbPosition(percentage);
    this.rateTimeline.updateLabel(RenderLoop.DEFAULT_TICKS);

    this.imageData.data.fill(0);

    this.selectedColorIndices = new Array(pixelColors.length).fill(true);

    loadAllChunks(this.processData);

    // if (window.Worker) {
    //   const worker = new ChunkWorker();
    //   worker.postMessage({
    //     numberOfChanges: PlaceRenderer.NUMBER_OF_CHANGES,
    //     width: this.canvas.width,
    //     height: this.canvas.height
    //   });
    //
    //   worker.onmessage = (e: MessageEvent) => {
    //     const start = performance.now();
    //     // const [changes, newColorIndices, newChangedCoordinates, newChangedColorIndicesBackward] = e.data;
    //     console.log(e.data);
    //     console.log(performance.now() - start);
    //     // this.changedCoordinates = newChangedCoordinates;
    //     // this.changedColorIndices = newColorIndices;
    //     // this.changedColorIndicesBackwards = newChangedColorIndicesBackward;
    //     // this.numberOfLoadedChanges = changes;
    //     // rendererState.timePercentage = this.numberOfLoadedChanges / PlaceRenderer.NUMBER_OF_CHANGES;
    //   };
    // }
  }

  processData = (view: DataView) => {
    const start = performance.now();
    let count = 0;
    for (let row = 0; row < view.byteLength; row += 5) {
      const x = view.getInt16(row, true);
      const y = view.getInt16(row + 2, true);
      const c = view.getInt8(row + 4);

      const p = x + y * this.canvas.width;
      const chunkOffset = count + this.numberOfLoadedChanges;

      this.changedColorIndices[chunkOffset] = c;
      this.changedCoordinates[chunkOffset] = p;

      this.changedColorIndicesBackwards[chunkOffset] = this.temporaryCanvasState[p];
      this.temporaryCanvasState[p] = c;
      count++;
    }
    this.numberOfLoadedChanges += count;
    rendererState.timePercentage = this.numberOfLoadedChanges / PlaceRenderer.NUMBER_OF_CHANGES;
    console.log(`Needed ${performance.now() - start}ms to process chunk`);
  };

  render(t: number): void {
    if (this.rateTimeline.changed) {
      this.rateTimeline.changed = false;
      const amount = (this.rateTimeline.percentage * 2) / 100 - 1;
      const newTicks = amount * RenderLoop.MAX_TICKS;
      this.renderLoop.ticks = newTicks;
      this.rateTimeline.updateLabel(Math.round(newTicks));
    }

    const percentageFallOf = 9 / (this.pixelLifespan * this.pixelLifespan);

    if (this.timeTimeline.changed) {
      this.timeTimeline.changed = false;
      t = (this.timeTimeline.percentage / 100) * PlaceRenderer.NUMBER_OF_CHANGES;
      this.renderLoop.updateCurrTime(t);
    }

    if (t < 0) {
      t = 0;
      this.renderLoop.updateCurrTime(t);
    }

    if (t > this.numberOfLoadedChanges - 1) {
      t = this.numberOfLoadedChanges - 1;
      this.renderLoop.updateCurrTime(this.numberOfLoadedChanges - 1);

      for (let i = 0; i < this.colorGrid.length; i++) {
        if (this.pixelLifespans[i] > 0) {
          this.pixelLifespans[i] = this.pixelLifespans[i] - percentageFallOf;
        }
      }
    }
    const frames = Math.round(t - this.numberOfCurrentVisibleChanges);

    if (frames != 0) {
      const changes = frames > 0 ? this.changedColorIndices : this.changedColorIndicesBackwards;

      const step = frames / Math.abs(frames);
      const end = this.numberOfCurrentVisibleChanges + frames;

      for (let i = this.numberOfCurrentVisibleChanges; i !== end; i += step) {
        const coordinate = this.changedCoordinates[i];
        this.colorGrid[coordinate] = changes[i];
        this.pixelLifespans[coordinate] = this.pixelLifespan;
      }

      this.numberOfCurrentVisibleChanges = end;
    }

    const data = this.imageData.data;

    for (let i = 0; i < this.colorGrid.length; i++) {
      if (this.pixelLifespans[i] > this.pixelLifespan) {
        this.pixelLifespans[i] = 0;
      }

      const pixel = i * 4;
      let color;
      if (this.renderMode === 0) {
        const colorIndex = this.colorGrid[i];
        if (this.selectedColorIndices[colorIndex]) {
          color = pixelColors[colorIndex];
        } else {
          color = [0, 0, 0];
        }
      } else {
        color = heatMapColorMaps[this.selectedColorMap][~~((this.pixelLifespans[i] / this.pixelLifespan) * 9)];
      }

      data[pixel] = color[0];
      data[pixel + 1] = color[1];
      data[pixel + 2] = color[2];

      data[pixel + 3] = 255;
      if (frames != 0) {
        if (this.pixelLifespans[i] > 0) {
          this.pixelLifespans[i] -= 1;
        }
        if (this.pixelLifespans[i] > this.pixelLifespan) {
          this.pixelLifespans[i] = 0;
        }
      }
    }

    // Takes on average 9ms
    this.ctx.putImageData(this.imageData, 0, 0);
    this.timeTimeline.updateThumbPosition((this.numberOfCurrentVisibleChanges / PlaceRenderer.NUMBER_OF_CHANGES) * 100);
    this.timeTimeline.updateLabel(Math.floor(t));
  }

  private initializeArrays(): void {
    this.changedCoordinates = new Uint32Array(PlaceRenderer.NUMBER_OF_CHANGES);
    this.changedColorIndices = new Uint8Array(PlaceRenderer.NUMBER_OF_CHANGES);
    this.changedColorIndicesBackwards = new Uint8Array(PlaceRenderer.NUMBER_OF_CHANGES);

    const canvasSize = this.canvas.width * this.canvas.height;

    this.temporaryCanvasState = new Uint8Array(canvasSize);
    this.pixelLifespans = new Uint8Array(canvasSize);
    this.temporaryCanvasState.fill(PlaceRenderer.DEFAULT_BACKGROUND_COLOR_INDEX);

    this.colorGrid = new Uint8Array(canvasSize);
    this.colorGrid.fill(PlaceRenderer.DEFAULT_BACKGROUND_COLOR_INDEX);
  }
}
