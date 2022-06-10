import { CanvasRenderer } from '@/renderer/canvasRenderer';
import { Timeline } from '@/components/renderer/place/timeline/timeline';
import { ActivityDiagram } from '@/components/renderer/place/diagrams/activityDiagram';
import { loadAllChunks } from '@/lib/chunkLoader';

import WorkerString from './renderWorker.js?raw';
import { heatMapColorMaps, pixelColors } from '@/model/colorMapping';
import { rendererState } from '@/renderer/rendererState';
import { ColorDiagram } from '@/components/renderer/place/diagrams/colorDiagram';

import { pixelToCleanUp } from '@/lib/cleanUpPixels';

export class PlaceRenderer extends CanvasRenderer {
  public static NUMBER_OF_CHANGES = 160353105;
  public static DEFAULT_PIXEL_LIFESPAN = 10;

  changedCoordinatesBuffer!: SharedArrayBuffer;
  changedCoordinates!: Uint32Array;
  changeColorIndicesBuffer!: SharedArrayBuffer;
  changedColorIndices!: Uint8Array;
  changedColorIndicesBackwardsBuffer!: SharedArrayBuffer;
  changedColorIndicesBackwards!: Uint8Array;
  pixelLifespans!: Uint8Array;

  temporaryCanvasState!: Uint8Array;

  numberOfLoadedChanges: number = 0;
  numberOfCurrentVisibleChanges: number = 0;

  timeTimeline: Timeline;
  rateTimeline: Timeline;

  activityDiagram: ActivityDiagram;
  colorDiagram: ColorDiagram;

  colorCountsBuffer: SharedArrayBuffer;
  colorCounts: Uint32Array;

  offscreenCanvas!: OffscreenCanvas;
  isRunning: boolean = false;

  selectedColorsBuffer: SharedArrayBuffer;
  selectedColorsArray: Uint8Array;

  selectedHeatMapBuffer: SharedArrayBuffer;
  selectedHeatMapArray: Uint8Array;

  worker!: Worker;

  DEFAULT_TICKS = 1000;
  MAX_TICKS = 10000;

  constructor(element: HTMLCanvasElement) {
    super(element);

    this.canvasEvents.registerStatisticEvent();

    this.initializeArrays();

    this.timeTimeline = new Timeline('time');
    this.activityDiagram = new ActivityDiagram('activity');
    this.rateTimeline = new Timeline('rate');
    this.colorDiagram = new ColorDiagram('color-diagram');
    const percentage = (0.5 + (this.DEFAULT_TICKS / this.MAX_TICKS) * 0.5) * 100;
    this.rateTimeline.updateThumbPosition(percentage);
    this.rateTimeline.updateLabel(this.DEFAULT_TICKS);

    this.colorCountsBuffer = new SharedArrayBuffer(pixelColors.length * 4);
    this.colorCounts = new Uint32Array(this.colorCountsBuffer).fill(0);

    this.selectedHeatMapBuffer = new SharedArrayBuffer(1);
    this.selectedHeatMapArray = new Uint8Array(this.selectedHeatMapBuffer).fill(0);

    this.selectedColorsBuffer = new SharedArrayBuffer(pixelColors.length);
    this.selectedColorsArray = new Uint8Array(this.selectedColorsBuffer).fill(1);

    loadAllChunks(this.processData, (percentage) => (rendererState.chunkProgress = percentage));
  }

  stop() {
    super.stop();
    rendererState.isRunning = false;
    this.worker.postMessage({
      stop: true
    });
  }

  restart() {
    super.restart();
    this.worker.postMessage({
      start: true
    });
  }

  start() {
    if (window.Worker) {
      const workerBlob = new Blob([WorkerString], { type: 'text/javascript' });
      const workerURL = URL.createObjectURL(workerBlob);
      this.worker = new Worker(workerURL, { type: 'classic' });

      // @ts-ignore
      this.offscreenCanvas = this.canvas.transferControlToOffscreen();
      // @ts-ignore
      this.worker.postMessage(
        {
          render: {
            canvas: this.offscreenCanvas,
            changedColorIndices: this.changeColorIndicesBuffer,
            changedColorIndicesBackwards: this.changedColorIndicesBackwardsBuffer,
            changedCoordinates: this.changedCoordinatesBuffer,
            colorCounts: this.colorCountsBuffer,
            selectedColors: this.selectedColorsBuffer,
            selectedHeatMap: this.selectedHeatMapBuffer
          }
        },
        [this.offscreenCanvas]
      );

      this.worker.postMessage({
        pixelLifespan: PlaceRenderer.DEFAULT_PIXEL_LIFESPAN,
        renderMode: 0,
        numberOfLoadedChanges: this.numberOfLoadedChanges
      });

      this.worker.onmessage = (e) => {
        if (e.data.update !== undefined) {
          this.colorDiagram.updateData(this.colorCounts);
          this.timeTimeline.updateThumbPosition((e.data.update / PlaceRenderer.NUMBER_OF_CHANGES) * 100);
          this.timeTimeline.updateLabel(Math.floor(e.data.update));
          this.activityDiagram.updatePosition(Math.floor(e.data.update));
        }
      };
    }
  }

  togglePlay() {
    this.worker.postMessage({
      togglePlay: true
    });

    rendererState.isRunning = !rendererState.isRunning;
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

    const percentage = this.numberOfLoadedChanges / PlaceRenderer.NUMBER_OF_CHANGES;
    if (percentage > 0.9 && percentage < 0.95) {
      this.cleanUpPixels();
    }

    if (this.worker) {
      this.worker.postMessage({
        numberOfLoadedChanges: this.numberOfLoadedChanges
      });
    }

    console.log(`Needed ${performance.now() - start}ms to process chunk`);
  };

  cleanUpPixels() {
    for (const pixel of pixelToCleanUp) {
      const x = pixel[0];
      const y = pixel[1];
      const c = 31;
      const p = y + x * this.canvas.width;
      const chunkOffset = this.numberOfLoadedChanges;
      this.changedColorIndices[chunkOffset] = c;
      this.changedCoordinates[chunkOffset] = p;

      this.changedColorIndicesBackwards[chunkOffset] = this.temporaryCanvasState[p];
      this.temporaryCanvasState[p] = c;
      this.numberOfLoadedChanges++;
    }
  }

  toggleSelectedColor(index: number) {
    if (index > this.selectedColorsArray.length - 1) {
      throw new Error('Invalid color index');
    }
    this.selectedColorsArray[index] = 1 - this.selectedColorsArray[index];
    this.activityDiagram.updateSelectedColors(index, this.selectedColorsArray[index]);
    this.colorDiagram.updateSelectedColors(index, this.selectedColorsArray[index]);
  }

  toggleAllColors(visible: boolean) {
    if (visible) {
      this.selectedColorsArray.fill(1);
    } else {
      this.selectedColorsArray.fill(0);
    }
    this.colorDiagram.toggleAllColors(visible);
    this.activityDiagram.toggleAllColors(visible);
  }

  updateTimeline() {
    if (this.rateTimeline.changed) {
      this.rateTimeline.changed = false;

      const amount = (this.rateTimeline.percentage * 2) / 100 - 1;
      const newTicks = amount * this.MAX_TICKS;
      this.rateTimeline.updateLabel(Math.round(newTicks));
      this.worker.postMessage({
        rateTimeline: newTicks
      });
    }

    if (this.timeTimeline.changed) {
      this.timeTimeline.changed = false;
      const newT = (this.timeTimeline.percentage / 100) * PlaceRenderer.NUMBER_OF_CHANGES;
      this.worker.postMessage({
        timeTimeline: newT
      });
    }
  }

  updateSelectedHeatMap(value: number) {
    if (value < 0 || value > heatMapColorMaps.length - 1) {
      throw new Error('Invalid heatmap value');
    }
    this.selectedHeatMapArray[0] = value;
  }

  reset() {
    super.reset();
    this.toggleAllColors(true);
    rendererState.selectedColors.fill(true);
    this.worker.postMessage({
      reset: true
    });
    rendererState.isRunning = false;
  }

  private initializeArrays(): void {
    this.changedCoordinatesBuffer = new SharedArrayBuffer(PlaceRenderer.NUMBER_OF_CHANGES * 4);
    this.changedCoordinates = new Uint32Array(this.changedCoordinatesBuffer);
    this.changeColorIndicesBuffer = new SharedArrayBuffer(PlaceRenderer.NUMBER_OF_CHANGES);
    this.changedColorIndices = new Uint8Array(this.changeColorIndicesBuffer);
    this.changedColorIndicesBackwardsBuffer = new SharedArrayBuffer(PlaceRenderer.NUMBER_OF_CHANGES);
    this.changedColorIndicesBackwards = new Uint8Array(this.changedColorIndicesBackwardsBuffer);

    const canvasSize = this.canvas.width * this.canvas.height;

    this.temporaryCanvasState = new Uint8Array(canvasSize);
    this.pixelLifespans = new Uint8Array(canvasSize);
    this.temporaryCanvasState.fill(255);
  }

  set renderMode(value: number) {
    if (value > 1 || value < 0) {
      throw new Error('Invalid render mode');
    }

    this.worker.postMessage({
      renderMode: value
    });
  }

  set pixelLifespan(value: number) {
    this.worker.postMessage({
      pixelLifespan: value
    });
  }
}
