import { CanvasRenderer } from '@/renderer/canvasRenderer';
import { selectedUsers, userPixels } from '@/renderer/rendererState';
import chroma from 'chroma-js';

type Lines = { x: [number, number]; y: [number, number] }[];
type Points = [number, number][];

export class UserRenderer extends CanvasRenderer {
  constructor(element: HTMLCanvasElement) {
    super(element);
    this.ctx = this.canvas.getContext('2d')!;
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const users = new Map<string, { lines: Lines; points: Points }>();

    let lines: Lines = [];
    let points: Points = [];

    selectedUsers.forEach((user) => {
      const userData = userPixels.get(user)!;
      for (let i = 0; i < userData.length; i++) {
        if (userData[i + 1]) {
          lines.push({ x: [userData[i][1], userData[i][0]], y: [userData[i + 1][1], userData[i + 1][0]] });
        } else if (i == 0) {
          points.push([userData[i][1], userData[i][0]]);
        }
      }

      users.set(user, { lines, points });
      lines = [];
      points = [];
    });

    users.forEach(({ lines, points }) => {
      const c = chroma.scale('Spectral').domain([0, Math.max(1, lines.length)]);

      lines.forEach(({ x, y }, ind) => {
        if (ind == 0) {
          this.ctx.fillStyle = c(ind).hex();
          this.ctx.strokeStyle = 'black';
          this.ctx.beginPath();
          this.ctx.ellipse(x[0], x[1], 10, 10, Math.PI / 4, 0, 2 * Math.PI);
          this.ctx.fill();
        }
        this.drawLineWithArrow(x, y, c(ind).hex());

        if (ind == lines.length - 1) {
          this.ctx.fillStyle = c(ind).hex();
          this.ctx.strokeStyle = 'black';
          this.ctx.beginPath();
          this.ctx.ellipse(y[0], y[1], 10, 10, Math.PI / 4, 0, 2 * Math.PI);
          this.ctx.fill();
        }
      });

      points.forEach(([x, y], ind) => {
        this.ctx.fillStyle = c(ind).hex();
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
        this.ctx.fill();
      });
    });
  }

  reset() {
    super.reset();
    selectedUsers.clear();
    this.render();
  }

  togglePlay(): void {}

  private drawLineWithArrow(begin: [number, number], end: [number, number], stroke = 'red', width = 2) {
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();

    const headlen = 10;
    const dx = end[0] - begin[0];
    const dy = end[1] - begin[1];
    const angle = Math.atan2(dy, dx);
    this.ctx.moveTo(...begin);
    this.ctx.lineTo(...end);
    this.ctx.lineTo(end[0] - headlen * Math.cos(angle - Math.PI / 6), end[1] - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(...end);
    this.ctx.lineTo(end[0] - headlen * Math.cos(angle + Math.PI / 6), end[1] - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }
}
