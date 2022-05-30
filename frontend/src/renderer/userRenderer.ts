import { CanvasRenderer } from '@/renderer/2d/canvasRenderer';
import { selectedUsers, userPixels } from '@/renderer/rendererState';
import { pixelColors } from '@/model/colorMapping';

export class UserRenderer extends CanvasRenderer {
  constructor(element: HTMLCanvasElement) {
    super(element);
  }

  render(t: number): void {
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
}
