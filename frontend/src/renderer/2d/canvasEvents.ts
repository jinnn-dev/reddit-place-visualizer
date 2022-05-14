import type {CanvasRenderer} from "@/renderer/2d/canvasRenderer";

export class CanvasEvents {

    lastX: number = 0;
    lastY: number = 0;
    dragStartX: number = 0;
    dragStartY: number = 0;
    isMouseDown: boolean = false;

    constructor(public renderer: CanvasRenderer) {
    }

    zoomOnScroll() {
        this.renderer.canvas.parentElement!.addEventListener('wheel', (event: WheelEvent) => {
            this.renderer.zoom(event.deltaY * -0.001)
        }, {
            passive: true
        })
    }

    panOnMouseMove() {
        this.renderer.canvas.parentElement!.addEventListener('mousedown', (event: MouseEvent) => {
            this.lastX = event.offsetX || (event.pageX - this.renderer.canvas.offsetLeft);
            this.lastY = event.offsetY || (event.pageY - this.renderer.canvas.offsetTop);
            this.dragStartX = this.lastX
            this.dragStartY = this.lastY
            this.isMouseDown = true
        })

        this.renderer.canvas.parentElement!.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.isMouseDown) {
                this.lastX = event.offsetX || (event.pageX - this.renderer.canvas.offsetLeft);
                this.lastY = event.offsetY || (event.pageY - this.renderer.canvas.offsetTop);
                const diffX = this.dragStartX - this.lastX;
                const diffY = this.dragStartY - this.lastY;
                this.renderer.transform(-diffX, -diffY)
            }
        })

        this.renderer.canvas.parentElement!.addEventListener('mouseup', (event: MouseEvent) => {
            this.isMouseDown = false;
        })
    }


    registerEvents() {
        this.zoomOnScroll();
        this.panOnMouseMove()
    }
}


