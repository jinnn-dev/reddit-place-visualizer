import type { CanvasRenderer } from '@/renderer/2d/canvasRenderer';
import { registerCenterEvent, registerSpacebarEvent } from '@/lib/events';
import { HoverService } from '@/services/HoverService';
import { mousePosition } from '@/store/mouse';

export class CanvasEvents {
  lastX: number = 0;
  lastY: number = 0;
  dragStartX: number = 0;
  dragStartY: number = 0;
  isMouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;

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

  scale = (inputY: number, yRange: Array<number>, xRange: Array<number>): number => {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;

    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;

    return outputX;
  };

  getPixel = async (event: MouseEvent) => {
    const rect = this.renderer.canvas.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    const scaledX = Math.floor(this.scale(x, [rect.left, rect.right], [0, 2000]));
    const scaledY = Math.floor(this.scale(y, [rect.top, rect.bottom], [0, 2000]));

    try {
      const position = { x: scaledX, y: scaledY };
      console.log(position);

      const data = await HoverService.getPixelData(position);
      mousePosition.data = data;
      mousePosition.canvasX = scaledX;
      mousePosition.canvasY = scaledY;
      mousePosition.visible = true;

      console.log(data);
    } catch (err) {
      console.log(err);
    }

    mousePosition.x = event.pageX;
    mousePosition.y = event.pageY;
  };

  panMouseMoveEvent = (event: MouseEvent) => {
    if (this.isMouseDown) {
      this.lastX = event.offsetX || event.pageX - this.renderer.canvas.offsetLeft;
      this.lastY = event.offsetY || event.pageY - this.renderer.canvas.offsetTop;
      const diffX = this.dragStartX - this.lastX;
      const diffY = this.dragStartY - this.lastY;
      this.renderer.transform(-diffX, -diffY);
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

  registerStatisticEvent() {
    const delta = 6;

    this.renderer.canvas.addEventListener('mouseup', (event) => {
      const diffX = Math.abs(event.pageX - this.startX);
      const diffY = Math.abs(event.pageY - this.startY);

      if (diffX < delta && diffY < delta) {
        this.getPixel(event);
      }
    });
  }

  registerEvents() {
    this.zoomOnScroll();
    this.panOnMouseMove();

    registerSpacebarEvent(this.renderer.togglePlay.bind(this.renderer));
    registerCenterEvent(() => {
      this.renderer.center();
    });
  }
}
