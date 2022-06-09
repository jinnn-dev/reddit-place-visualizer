import { CanvasEvents } from '@/renderer/events/canvasEvents';

export abstract class CanvasRenderer {
  ctx!: CanvasRenderingContext2D;

  viewport: HTMLElement;

  currentScale: number = 0.5;
  transformX: number = 0;
  transformY: number = 0;

  canvasEvents: CanvasEvents;

  protected constructor(public canvas: HTMLCanvasElement) {
    this.canvasEvents = new CanvasEvents(this);
    this.viewport = this.canvas.parentElement!;
    this.canvasEvents.registerEvents();

    const windowHeight = window.innerHeight;

    if (windowHeight < this.canvas.height) {
      this.currentScale = (windowHeight / this.canvas.height) * 0.7;
    } else {
      this.currentScale = (this.canvas.height / windowHeight) * 0.7;
    }
  }

  zoom(scale: number, x: number, y: number) {
    this.scale(this.currentScale * scale, x, y);
  }

  fit() {
    this.canvasEvents.offset.x = 0;
    this.canvasEvents.offset.y = 0;

    const sx = window.innerWidth / this.canvas.width;
    const sy = window.innerHeight / this.canvas.height;
    const sv = Math.floor(Math.log2(Math.min(sx, sy)));

    this.scale(sv > 0 ? 3 : 1 / 3, 0, 0);
  }

  scale(value: number, x: number, y: number) {
    const s = Math.min(64, Math.max(1 / 8, value));
    const oldScale = this.currentScale;
    const deltaScale = 1 / s - 1 / oldScale;

    this.canvasEvents.offset.x += x * deltaScale;
    this.canvasEvents.offset.y += y * deltaScale;
    this.canvasEvents.currentScale = 1 / s;
    this.currentScale = s;

    this.transform();
  }

  center() {
    this.canvasEvents.active = true;
    const rect = this.canvas.getBoundingClientRect();
    const moveX = -rect.left + (this.viewport.offsetWidth / 2 - (this.canvas.width * this.currentScale) / 2);
    const moveY = -rect.top + (this.viewport.offsetHeight / 2 - (this.canvas.height * this.currentScale) / 2);
    this.canvasEvents.move(moveX, moveY);
    this.canvasEvents.active = false;
    this.transform();
  }

  reset() {
    this.canvasEvents.reset();
    this.fit();
    this.center();
  }

  stop() {
    this.canvasEvents.resetEvents();
  }

  restart() {
    this.canvasEvents.registerEvents();
  }

  transform() {
    this.transformX = this.canvasEvents.offset.x - this.canvas.width / 2 + this.viewport.offsetWidth / 2;
    this.transformY = this.canvasEvents.offset.y - this.canvas.height / 2 + this.viewport.offsetHeight / 2;

    this.updateTransform();
  }

  abstract togglePlay(): void;

  updateTransform() {
    this.canvas.style.transform = `scale(${this.currentScale}) `;
    this.canvas.style.transform += `translate(${this.transformX}px, ${this.transformY}px)`;
  }
}
