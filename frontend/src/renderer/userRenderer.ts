import { CanvasRenderer } from '@/renderer/canvasRenderer';
import { selectedUsers, userPixels } from '@/renderer/rendererState';
import { pixelColors } from '@/model/colorMapping';

export class UserRenderer extends CanvasRenderer {
  private readonly imageData: ImageData;

  constructor(element: HTMLCanvasElement) {
    super(element);
    this.ctx = this.canvas.getContext('2d')!;
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  render(): void {
    const data = this.imageData.data;
    data.fill(255);
    selectedUsers.forEach((user) => {
      const userData = userPixels.get(user)!;
      for (let i = 0; i < userData.length; i++) {
        const c = userData[i][2];
        const position = userData[i][1] * 4 + userData[i][0] * 4 * this.canvas.width;
        const color = pixelColors[c];
        data[position] = color[0];
        data[position + 1] = color[1];
        data[position + 2] = color[2];
        data[position + 3] = 255;
      }
    });

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  togglePlay(): void {}
}
