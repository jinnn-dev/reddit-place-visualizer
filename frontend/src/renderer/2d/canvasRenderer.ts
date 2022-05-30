import { CanvasEvents } from '@/renderer/2d/canvasEvents';

export abstract class CanvasRenderer {
  ctx!: CanvasRenderingContext2D;

  scale: number = 0.5;
  transformX: number = 0;
  transformY: number = 0;

  canvasEvents: CanvasEvents;

  protected constructor(public canvas: HTMLCanvasElement) {
    this.canvasEvents = new CanvasEvents(this);
    this.canvasEvents.registerEvents();

    const windowHeight = window.innerHeight;

    if (windowHeight < this.canvas.height) {
      this.scale = (windowHeight / this.canvas.height) * 0.5;
    } else {
      this.scale = (this.canvas.height / windowHeight) * 0.5;
    }

    this.updateTransform();
  }

  zoom(scale: number) {
    if (this.scale + scale > 0) {
      this.scale += scale * this.scale;
      this.updateTransform();
    }
  }

  transform(x: number, y: number) {
    this.transformX += x;
    this.transformY += y;
    this.updateTransform();
  }

  togglePlay() {}

  private updateTransform() {
    this.canvas.style.transform = `scale(${this.scale}, ${this.scale}) `;
    this.canvas.style.transform += `translate(${this.transformX}px, ${this.transformY}px)`;
  }
}
