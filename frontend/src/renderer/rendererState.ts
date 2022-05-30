import { reactive } from 'vue';
import { RenderLoop } from '@/renderer/renderLoop';

export enum VISUALIZATION_MODE {
  PIXEL,
  HEATMAP
}

export const rendererState = reactive({
  timePercentage: 0,
  timePercentageChanged: false,
  mode: VISUALIZATION_MODE.PIXEL
});

export const timelineState = reactive({
  changed: false
});
export const userPixels = new Map<string, number[][]>();

export const selectedUsers = reactive(new Set<string>());
