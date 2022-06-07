import { HoverService } from '@/services/HoverService';
import { mousePosition } from '@/store/mouse';
import { registerSpacebarEvent } from '@/lib/events';
import type { UserRenderer } from '@/renderer/userRenderer';
import { CanvasEvents } from '@/renderer/2d/canvasEvents';

export class UserCanvasEvents extends CanvasEvents {
  constructor(public renderer: UserRenderer) {
    super(renderer);
  }

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

  scale = (inputY: number, yRange: Array<number>, xRange: Array<number>): number => {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;

    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;

    return outputX;
  };

  panMouseMoveEvent = (event: MouseEvent) => {
    if (this.isMouseDown) {
      this.lastX = event.offsetX || event.pageX - this.renderer.canvas.offsetLeft;
      this.lastY = event.offsetY || event.pageY - this.renderer.canvas.offsetTop;
      const diffX = this.dragStartX - this.lastX;
      const diffY = this.dragStartY - this.lastY;
      (this.renderer as UserRenderer).userTransform(-diffX, -diffY);
      mousePosition.visible = false;
    }
  };

  panOnMouseMove() {
    this.renderer.canvas.parentElement!.addEventListener('mousedown', this.panMouseDownEvent);
    this.renderer.canvas.parentElement!.addEventListener('mousemove', this.panMouseMoveEvent);

    this.renderer.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      this.startX = event.pageX;
      this.startY = event.pageY;
    });

    this.renderer.canvas.parentElement!.addEventListener('mouseup', (event: MouseEvent) => {
      this.isMouseDown = false;
    });
  }

  registerEvents() {
    this.zoomOnScroll();
    this.panOnMouseMove();

    registerSpacebarEvent(this.renderer.togglePlay.bind(this.renderer));
  }
}
