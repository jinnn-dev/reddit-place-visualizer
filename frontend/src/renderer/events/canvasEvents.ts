import type { CanvasRenderer } from '@/renderer/canvasRenderer';
import { registerRKeyEvent, registerSpacebarEvent } from '@/lib/events';
import { HoverService } from '@/services/HoverService';
import { mousePosition } from '@/store/mouse';

interface Point {
  x: number;
  y: number;
}

export class CanvasEvents {
  lastX: number = 0;
  lastY: number = 0;
  dragStartX: number = 0;
  dragStartY: number = 0;
  isMouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;

  offset: Point = { x: 0, y: 0 };
  origin: Point = { x: 0, y: 0 };
  begin: Point = { x: 0, y: 0 };
  point: Point = { x: 0, y: 0 };
  delta: Point = { x: 0, y: 0 };

  min: Point = { x: 0, y: 0 };
  max: Point = { x: 0, y: 0 };

  active = false;
  disabled = false;
  currentScale = 1;
  changed = false;

  constructor(public renderer: CanvasRenderer) {
    this.reset();
  }

  reset() {
    this.offset.x = this.offset.y = 0;
    this.origin.x = this.origin.y = 0;
    this.begin.x = this.begin.y = 0;
    this.point.x = this.point.y = 0;
    this.delta.x = this.delta.y = 0;

    this.max.x = this.max.y = Infinity;
    this.min.x = this.min.y = -Infinity;
  }

  start(x: number, y: number) {
    this.active = true;
    this.changed = false;

    this.delta.x = 0;
    this.delta.y = 0;

    this.begin.x = x;
    this.begin.y = y;

    this.origin.x = this.offset.x;
    this.origin.y = this.offset.y;
  }

  move(x: number, y: number) {
    if (!this.active) return;

    this.changed = true;

    this.delta.x = x - this.begin.x;
    this.delta.y = y - this.begin.y;

    this.offset.x = this.origin.x + this.delta.x * this.currentScale;
    this.offset.y = this.origin.y + this.delta.y * this.currentScale;

    this.offset.x = Math.min(this.max.x, Math.max(this.min.x, this.offset.x));
    this.offset.y = Math.min(this.max.y, Math.max(this.min.y, this.offset.y));
  }

  end() {
    this.active = false;
  }

  onScroll = (event: any) => {
    const delta = -event.deltaY;
    const value = delta / Math.abs(delta);
    const x = event.pageX - this.renderer.canvas.width / 2;
    const y = event.pageY - this.renderer.canvas.height / 2;
    const scrollFactor = 0.002;
    const s = value > 0 ? 1 + delta * scrollFactor : 1 - -delta * scrollFactor;
    this.renderer.zoom(s, x, y);
  };

  zoomOnScroll() {
    this.renderer.viewport!.addEventListener('wheel', this.onScroll, {
      passive: true
    });
  }

  panMouseDownEvent = (e: any) => {
    if (this.disabled) return;

    this.point.x = 0;
    this.point.y = 0;

    if (e.touches) {
      let l = e.touches.length;
      for (let i = 0; i < l; i++) {
        let p = e.touches[i];

        this.point.x += p.pageX;
        this.point.y += p.pageY;
      }

      this.point.x /= l;
      this.point.y /= l;
    } else {
      this.point.x = e.pageX;
      this.point.y = e.pageY;
    }

    this.start(this.point.x, this.point.y);
    this.isMouseDown = true;

    // this.lastX = e.offsetX || e.pageX - this.renderer.canvas.offsetLeft;
    // this.lastY = e.offsetY || e.pageY - this.renderer.canvas.offsetTop;
    // this.dragStartX = this.lastX;
    // this.dragStartY = this.lastY;
    // this.isMouseDown = true;
  };

  scale(inputY: number, yRange: Array<number>, xRange: Array<number>): number {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;

    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;

    return outputX;
  }

  getPixel = async (event: MouseEvent) => {
    const rect = this.renderer.canvas.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    const scaledX = Math.floor(this.scale(x, [rect.left, rect.right], [0, 2000]));
    const scaledY = Math.floor(this.scale(y, [rect.top, rect.bottom], [0, 2000]));

    try {
      const position = { x: scaledX, y: scaledY };

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

  panMouseMoveEvent = (e: any) => {
    if (this.disabled) return;

    this.point.x = 0;
    this.point.y = 0;

    if (e.touches) {
      let l = e.touches.length;
      for (let i = 0; i < l; i++) {
        let p = e.touches[i];

        this.point.x += p.pageX;
        this.point.y += p.pageY;
      }

      this.point.x /= l;
      this.point.y /= l;
    } else {
      this.point.x = e.pageX;
      this.point.y = e.pageY;
    }

    if (!this.isMouseDown) {
      return;
    }
    this.move(this.point.x, this.point.y);

    // this.lastX = event.offsetX || event.pageX - this.renderer.canvas.offsetLeft;
    // this.lastY = event.offsetY || event.pageY - this.renderer.canvas.offsetTop;
    // const diffX = this.dragStartX - this.lastX;
    // const diffY = this.dragStartY - this.lastY;
    this.renderer.transform();
    mousePosition.visible = false;
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
      this.end();
    });
  }

  resetEvents() {
    this.renderer.canvas.parentElement!.removeEventListener('mousedown', this.panMouseDownEvent);
    this.renderer.canvas.parentElement!.addEventListener('mousemove', this.panMouseMoveEvent);
    this.renderer.viewport!.removeEventListener('wheel', this.onScroll);
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
    registerRKeyEvent(this.renderer.reset.bind(this.renderer));
  }
}
