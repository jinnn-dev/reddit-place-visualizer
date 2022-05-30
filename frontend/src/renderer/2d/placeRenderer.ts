import { CanvasRenderer } from '@/renderer/2d/canvasRenderer';
import { Timeline } from '@/components/timeline';
import { ActivityDiagram } from '@/components/activityDiagram';
import { RenderLoop } from '@/renderer/renderLoop';
import { loadAllChunks } from '@/lib/chunkLoader';

import WorkerString from '../worker.js?raw';
import { heatMapColorMaps, pixelColors } from '@/model/colorMapping';
import { rendererState } from '@/renderer/rendererState';
import { ColorDiagram } from '@/components/colorDiagram';
import type { OffscreenCanvas } from 'three';

export class PlaceRenderer extends CanvasRenderer {
  public static NUMBER_OF_CHANGES = 160353105;
  public static DEFAULT_BACKGROUND_COLOR_INDEX = 27;
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

  selectedColorMap: number = 0;
  selectedColorIndices: boolean[];

  offscreenCanvas!: OffscreenCanvas;
  isRunning: boolean = false;

  selectedColorsBuffer: SharedArrayBuffer;
  selectedColorsArray: Uint8Array;

  selectedHeatMapBuffer: SharedArrayBuffer;
  selectedHeatMapArray: Uint8Array;

  worker!: Worker;

  constructor(element: HTMLCanvasElement) {
    super(element);

    this.canvasEvents.registerStatisticEvent();

    this.initializeArrays();

    this.timeTimeline = new Timeline('time');
    this.activityDiagram = new ActivityDiagram('activity');
    this.rateTimeline = new Timeline('rate');
    this.colorDiagram = new ColorDiagram('color-diagram');
    const percentage = (0.5 + (RenderLoop.DEFAULT_TICKS / RenderLoop.MAX_TICKS) * 0.5) * 100;
    this.rateTimeline.updateThumbPosition(percentage);
    this.rateTimeline.updateLabel(RenderLoop.DEFAULT_TICKS);

    this.colorCountsBuffer = new SharedArrayBuffer(pixelColors.length * 4);
    this.colorCounts = new Uint32Array(this.colorCountsBuffer).fill(0);

    this.selectedColorIndices = new Array(pixelColors.length).fill(true);

    this.selectedHeatMapBuffer = new SharedArrayBuffer(1);
    this.selectedHeatMapArray = new Uint8Array(this.selectedHeatMapBuffer).fill(0);

    this.selectedColorsBuffer = new SharedArrayBuffer(pixelColors.length);
    this.selectedColorsArray = new Uint8Array(this.selectedColorsBuffer).fill(1);

    loadAllChunks(this.processData);
  }

  start() {
    this.isRunning = true;
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
    if (this.worker) {
      this.worker.postMessage({
        numberOfLoadedChanges: this.numberOfLoadedChanges
      });
    }
    rendererState.timePercentage =
      Math.floor((this.numberOfLoadedChanges / PlaceRenderer.NUMBER_OF_CHANGES) * 100) / 100;
    console.log(`Needed ${performance.now() - start}ms to process chunk`);
  };

  setAllSelectedColors(value: boolean) {
    let fillValue = 0;
    if (value) {
      fillValue = 1;
    }
    this.selectedColorsArray.fill(fillValue);
  }

  toggleSelectedColor(index: number) {
    if (index > this.selectedColorsArray.length - 1) {
      throw new Error('Invalid color index');
    }
    this.selectedColorsArray[index] = 1 - this.selectedColorsArray[index];
  }

  updateTimeline() {
    if (this.rateTimeline.changed) {
      this.rateTimeline.changed = false;

      const amount = (this.rateTimeline.percentage * 2) / 100 - 1;
      const newTicks = amount * RenderLoop.MAX_TICKS;
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
    this.temporaryCanvasState.fill(PlaceRenderer.DEFAULT_BACKGROUND_COLOR_INDEX);
  }
}
