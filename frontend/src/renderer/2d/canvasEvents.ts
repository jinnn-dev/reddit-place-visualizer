import type { CanvasRenderer } from '@/renderer/2d/canvasRenderer';
import { registerSpacebarEvent } from '@/lib/events';

export class CanvasEvents {
  lastX: number = 0;
  lastY: number = 0;
  dragStartX: number = 0;
  dragStartY: number = 0;
  isMouseDown: boolean = false;

  constructor(public renderer: CanvasRenderer) {}

  zoomOnScroll() {
    this.renderer.canvas.parentElement!.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        this.renderer.zoom(event.deltaY * -0.001);
      },
      {
        passive: true
      }
    );
  }

  panMouseDownEvent = (event: MouseEvent) => {
    this.lastX = event.offsetX || event.pageX - this.renderer.canvas.offsetLeft;
    this.lastY = event.offsetY || event.pageY - this.renderer.canvas.offsetTop;
    this.dragStartX = this.lastX;
    this.dragStartY = this.lastY;
    this.isMouseDown = true;
  };

  panMouseMoveEvent = (event: MouseEvent) => {
    if (this.isMouseDown) {
      this.lastX = event.offsetX || event.pageX - this.renderer.canvas.offsetLeft;
      this.lastY = event.offsetY || event.pageY - this.renderer.canvas.offsetTop;
      const diffX = this.dragStartX - this.lastX;
      const diffY = this.dragStartY - this.lastY;
      this.renderer.transform(-diffX, -diffY);
    }
  };

  panOnMouseMove() {
    this.renderer.canvas.parentElement!.addEventListener('mousedown', this.panMouseDownEvent);

    this.renderer.canvas.parentElement!.addEventListener('mousemove', this.panMouseMoveEvent);

    this.renderer.canvas.parentElement!.addEventListener('mouseup', (event: MouseEvent) => {
      this.isMouseDown = false;
    });
  }

  registerEvents() {
    this.zoomOnScroll();
    this.panOnMouseMove();

    registerSpacebarEvent(this.renderer.renderLoop.togglePlay.bind(this.renderer.renderLoop));
  }
}
