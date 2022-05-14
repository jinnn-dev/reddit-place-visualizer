import {CanvasEvents} from "@/renderer/2d/canvasEvents";
import {COLOR_MAPPING, colorScale, getHeatmapColor, perc2color} from "@/model/colorMapping";
import {RenderLoop} from "@/renderer/renderLoop";
import {loadAllChunks} from "@/lib/chunkLoader";

export class CanvasRenderer {

    public static numberOfChanges = 160353105;

    ctx!: CanvasRenderingContext2D;

    scale: number = 0.5;
    transformX: number = 0;
    transformY: number = 0;
    canvasEvents: CanvasEvents;

    imageData: ImageData
    grid: Uint8Array;

    coordinatesOfChanges: Uint32Array;
    colorsOfChanges: Uint8Array;
    colorsOfChangesBackwards: Uint8Array;
    temporaryCanvasState: Uint8Array;

    changedIndices: Uint8Array;

    numberOfLoadedChanges = 0;
    renderLoop: RenderLoop;

    currentVisibleChanges = 0;

    lifespan = 30;

    constructor(public canvas: HTMLCanvasElement) {

        this.coordinatesOfChanges = new Uint32Array(CanvasRenderer.numberOfChanges)
        this.colorsOfChanges = new Uint8Array(CanvasRenderer.numberOfChanges)
        this.colorsOfChangesBackwards = new Uint8Array(CanvasRenderer.numberOfChanges)
        this.temporaryCanvasState = new Uint8Array(this.canvas.width * this.canvas.height)
        this.changedIndices = new Uint8Array(this.canvas.width * this.canvas.height)
        this.temporaryCanvasState.fill(27);

        this.grid = new Uint8Array(this.canvas.width * this.canvas.height);
        this.grid.fill(27);

        this.initializeContext();
        this.updateTransform()

        this.canvasEvents = new CanvasEvents(this);
        this.canvasEvents.registerEvents()


        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        const data = this.imageData.data
        data.fill(0)

        // for (let i = 0; i < this.grid.length; i++) {
        //     const p = i * 4;
        //     const c = COLOR_MAPPING.get(this.grid[i])!
        //     data[p] = c[0]
        //     data[p + 1] = c[1]
        //     data[p + 2] = c[2]
        //     data[p + 3] = 255
        // }

        this.ctx.putImageData(this.imageData, 0, 0)

        loadAllChunks(this.processData.bind(this))
        this.renderLoop = new RenderLoop(this.render.bind(this));
        setTimeout(() => this.renderLoop.start())

    }

    processData(view: DataView) {
        const start = performance.now()
        let count = 0;
        for (let row = 0; row < view.byteLength; row += 5) {


            const x = view.getInt16(row, true)
            const y = view.getInt16(row + 2, true)
            const c = view.getInt8(row + 4)

            const p = x + y * this.canvas.width
            const chunkOffset = count + this.numberOfLoadedChanges;

            this.colorsOfChanges[chunkOffset] = c;
            this.coordinatesOfChanges[chunkOffset] = p;

            this.colorsOfChangesBackwards[chunkOffset] = this.temporaryCanvasState[p];
            this.temporaryCanvasState[p] = c;
            count++;
        }
        this.numberOfLoadedChanges += count;
        console.log(`Needed ${performance.now() - start}ms to process chunk`)
    }

    render(t: number) {
        const frames = Math.round(t - this.currentVisibleChanges);

        if (frames === 0) return;

        const changes = frames > 0 ? this.colorsOfChanges : this.colorsOfChangesBackwards;

        const step = frames / Math.abs(frames)
        const end = this.currentVisibleChanges + frames;

        for (let i = this.currentVisibleChanges; i !== end; i += step) {
            this.grid[this.coordinatesOfChanges[i]] = changes[i];
            this.changedIndices[this.coordinatesOfChanges[i]] = this.lifespan;
        }

        this.currentVisibleChanges = end;

        const data = this.imageData.data;

        for (let i = 0; i < this.grid.length; i++) {
            // const c = COLOR_MAPPING.get(this.grid[i])!;
            const p = i * 4;

            // if (this.changedIndices[i] == this.lifespan) {
            //     data[p] = c[0];
            //     data[p + 1] = c[1];
            //     data[p + 2] = c[2]
            //     data[p + 3] = 255
            // } else {
            //     // data[p + 3] = 255 * this.changedIndices[i] / this.lifespan;
            // }

            const c = perc2color(100 - (this.changedIndices[i] / this.lifespan) * 100)
            // const c = getHeatmapColor(1- (this.changedIndices[i] / this.lifespan));
            data[p] = c[0];
            data[p + 1] = c[1];
            data[p + 2] = c[2]
            data[p + 3] = 255

            if (this.changedIndices[i] > 0) {
                this.changedIndices[i] = this.changedIndices[i] - 1;
            }


            // if (this.changedIndices[i] < 0) {
            //     data[p + 3] = data[p + 3] - 10
            // } else {
            //     data[p] = c[0];
            //     data[p + 1] = c[1];
            //     data[p + 2] = c[2]
            //     data[p + 3] = 255
            //     this.changedIndices[i] = 0;
            // }
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }

    // render(t: number) {
    //     const frames = Math.round(t - this.currentVisibleChanges);
    //
    //     const changes = frames > 0 ? this.colorsOfChanges : this.colorsOfChangesBackwards;
    //
    //     const step = frames / Math.abs(frames)
    //     const end = this.currentVisibleChanges + frames;
    //     for (let i = this.currentVisibleChanges; i !== end; i += step) {
    //         this.grid[this.coordinatesOfChanges[i]] = changes[i];
    //     }
    //
    //     this.currentVisibleChanges = end;
    //
    //     const data = this.imageData.data;
    //
    //     for (let i = 0; i < this.grid.length; i++) {
    //         const c = COLOR_MAPPING.get(this.grid[i])!;
    //         const p = i * 4;
    //
    //         data[p] = c[0];
    //         data[p + 1] = c[1];
    //         data[p + 2] = c[2]
    //         data[p + 3] = 255
    //     }
    //
    //     this.ctx.putImageData(this.imageData, 0, 0);
    // }

    zoom(scale: number) {
        if (this.scale + scale > 0) {
            this.scale += scale * this.scale;
            this.updateTransform()
        }
    }

    transform(x: number, y: number) {
        this.transformX += x;
        this.transformY += y
        this.updateTransform()
    }

    private updateTransform() {
        this.canvas.style.transform = `scale(${this.scale}, ${this.scale}) `
        this.canvas.style.transform += `translate(${this.transformX}px, ${this.transformY}px)`
    }

    private initializeContext() {
        const context = this.canvas.getContext('2d');
        if (context == null) {
            throw new Error("Could not create canvas context")
        }
        this.ctx = context;
    }
}