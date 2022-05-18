import { CanvasEvents } from '@/renderer/2d/canvasEvents';
import { RenderLoop } from '@/renderer/renderLoop';

export abstract class CanvasRenderer {
  ctx!: CanvasRenderingContext2D;

  scale: number = 0.5;
  transformX: number = 0;
  transformY: number = 0;

  canvasEvents: CanvasEvents;

  renderLoop: RenderLoop;

  imageData: ImageData;

  protected constructor(public canvas: HTMLCanvasElement) {
    this.initializeContext();
    this.updateTransform();

    this.renderLoop = new RenderLoop(this.renderCallback);
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    this.canvasEvents = new CanvasEvents(this);
    this.canvasEvents.registerEvents();

    setTimeout(() => this.renderLoop.start());
  }

  private renderCallback = (t: number) => {
    this.render(t);
  };

  abstract render(t: number): void;

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

  private initializeContext() {
    const context = this.canvas.getContext('2d');
    if (context == null) {
      throw new Error('Could not create canvas context');
    }
    this.ctx = context;
  }

  private updateTransform() {
    this.canvas.style.transform = `scale(${this.scale}, ${this.scale}) `;
    this.canvas.style.transform += `translate(${this.transformX}px, ${this.transformY}px)`;
  }
}
