import { Color, Scene } from 'three';
import { data } from '../mock-data';
import { Cube } from './cube';

export class PixelMap {
  elements: Cube[];
  constructor(public size: number) {
    this.elements = [];
  }

  generate() {
    for (const item of data) {
      const pixel = new Cube(this.size, this.size, new Color(item.pixel_color).getHex());
      pixel.setPosition(item.x, item.y);
      this.elements.push(pixel);
    }
  }
}
