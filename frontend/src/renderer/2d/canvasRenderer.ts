import {CanvasEvents} from "@/renderer/2d/canvasEvents";
import {COLOR_MAPPING} from "@/model/colorMapping";

export class CanvasRenderer {
    ctx!: CanvasRenderingContext2D;

    scale: number = 0.5;
    transformX: number = 0;
    transformY: number = 0;
    canvasEvents: CanvasEvents;

    constructor(public canvas: HTMLCanvasElement) {
        this.initializeContext();
        this.updateTransform()

        this.canvasEvents = new CanvasEvents(this);
        this.canvasEvents.registerEvents()

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        const data = imageData.data;

        const colorArray = new Uint8Array(this.canvas.width * this.canvas.height);
        const colorData = colorArray.fill(31)
        // for (let i = 0; i < colorData.length; i++) {
        //     colorData[i] = Math.floor(Math.random() * 31) + 1
        // }



        for (let i = 0; i < colorArray.length; i++) {
            let p = i * 4
            let c = COLOR_MAPPING.get(colorData[i])!
            if (c === undefined) {
                console.log(c, p ,i)
            }
            // if (c === undefined) {
            //     console.log(c, p)
            // } else {
            data[p] = c[0]
            data[p + 1] = c[1]
            data[p + 2] = c[2]
            data[p + 3] = 255
            // }

        }
        this.ctx.putImageData(imageData, 0, 0)

        setInterval(() => {
            for (let i = 0; i < colorData.length; i++) {
                colorData[i] = Math.floor(Math.random() * 31) + 1
            }

            const indices = []
            for (let i = 0; i < 1e5; i++) {
                const random = Math.floor(Math.random() * colorArray.length)
                indices.push(random)
            }

            indices.forEach(i => {
                let p = i * 4
                let c = COLOR_MAPPING.get(colorData[i])!
                data[p] = c[0]
                data[p + 1] = c[1]
                data[p + 2] = c[2]
                data[p + 3] = 255
            })


            this.ctx.putImageData(imageData, 0, 0)
        }, 300)
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