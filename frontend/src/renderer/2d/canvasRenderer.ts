import {CanvasEvents} from "@/renderer/2d/canvasEvents";
import {COLOR_MAPPING} from "@/model/colorMapping";
import {generateChanges} from "@/renderer/mock-data";

export class CanvasRenderer {
    ctx!: CanvasRenderingContext2D;

    scale: number = 0.5;
    transformX: number = 0;
    transformY: number = 0;
    canvasEvents: CanvasEvents;

    imageData: ImageData
    grid: Uint8Array;

    changes: number[][]
    currentTime: number = 0;


    constructor(public canvas: HTMLCanvasElement) {
        this.initializeContext();
        this.updateTransform()

        this.canvasEvents = new CanvasEvents(this);
        this.canvasEvents.registerEvents()

        this.grid = new Uint8Array(this.canvas.width * this.canvas.height);
        this.grid.fill(31);

        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        const data = this.imageData.data

        for (let i = 0; i < this.grid.length; i++) {
            const p = i * 4;
            const c = COLOR_MAPPING.get(this.grid[i])!
            data[p] = c[0]
            data[p + 1] = c[1]
            data[p + 2] = c[2]
            data[p + 3] = 255
        }

        this.ctx.putImageData(this.imageData, 0, 0)

        this.changes = generateChanges()
    }

    render(t: number) {
        const timeDiff = t - this.currentTime;
        const data = this.imageData.data;

        if (timeDiff < 0) {
            const currChanges = this.changes[t + 1];

            for (let j = 0; j < currChanges.length; j += 2) {
                const p = currChanges[j] * 4;
                data[p] = 255
                data[p + 1] = 255
                data[p + 2] = 255
                data[p + 3] = 255
            }
        } else {
            const start = performance.now()
            const currChanges = this.changes[this.currentTime + timeDiff];
            for (let j = 0; j < currChanges.length; j += 2) {
                const p = currChanges[j] * 4;
                const c = COLOR_MAPPING.get(currChanges[j + 1])!

                data[p] = c[0]
                data[p + 1] = c[1]
                data[p + 2] = c[2]
                data[p + 3] = 255
            }
            console.log(`Needed ${performance.now() - start}ms to apply changes to array`)
        }
        const start = performance.now()
        this.ctx.putImageData(this.imageData, 0, 0)
        console.log(`Needed ${performance.now() - start}ms to put image on canvas`)
        this.currentTime = t;

    }

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