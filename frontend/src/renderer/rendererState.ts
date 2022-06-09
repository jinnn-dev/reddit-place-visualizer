import { reactive, ref } from 'vue';
import type { PlaceRenderer } from '@/renderer/2d/placeRenderer';
import type { UserRenderer } from '@/renderer/userRenderer';

export enum VISUALIZATION_MODE {
  PIXEL,
  HEATMAP
}

export const rendererState = reactive({
  chunkProgress: 0,
  loadedChunks: 0,
  mode: VISUALIZATION_MODE.PIXEL
});

export const placeRenderer = ref<PlaceRenderer>();
export const userRenderer = ref<UserRenderer>();

export const timelineState = reactive({
  changed: false
});
export const userPixels = new Map<string, number[][]>();

export const selectedUsers = reactive(new Set<string>());
