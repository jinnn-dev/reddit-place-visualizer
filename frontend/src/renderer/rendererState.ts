import { reactive } from 'vue';

export enum VISUALIZATION_MODE {
  PIXEL,
  HEATMAP
}

export const rendererState = reactive({
  timePercentage: 0,
  timePercentageChanged: false,
  chunkProgress: 0,
  mode: VISUALIZATION_MODE.PIXEL
});

export const timelineState = reactive({
  changed: false
});
export const userPixels = new Map<string, number[][]>();

export const selectedUsers = reactive(new Set<string>());
