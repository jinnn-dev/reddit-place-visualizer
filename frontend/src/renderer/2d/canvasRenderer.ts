import { CanvasEvents } from '@/renderer/2d/canvasEvents';

export abstract class CanvasRenderer {
  ctx!: CanvasRenderingContext2D;

  scale: number = 0.5;
  transformX: number = -400;
  transformY: number = -1700;

  canvasEvents: CanvasEvents;

  protected constructor(public canvas: HTMLCanvasElement) {
    this.canvasEvents = new CanvasEvents(this);
    this.canvasEvents.registerEvents();

    const windowHeight = window.innerHeight;

    if (windowHeight < this.canvas.height) {
      this.scale = (windowHeight / this.canvas.height) * 0.7;
    } else {
      this.scale = (this.canvas.height / windowHeight) * 0.7;
    }

    //center canvas based on window size

    this.center();

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

  center() {
    // this.transformX = -400;
    // this.transformY = -1700;
    this.transformX = -(window.innerWidth / 4);
    this.transformY = -(window.innerHeight * 2);
    this.updateTransform();
  }

  togglePlay() {}

  private updateTransform() {
    this.canvas.style.transform = `scale(${this.scale}, ${this.scale}) `;
    this.canvas.style.transform += `translate(${this.transformX}px, ${this.transformY}px)`;
  }
}
