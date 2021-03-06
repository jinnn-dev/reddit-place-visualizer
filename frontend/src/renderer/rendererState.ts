import { reactive, ref } from 'vue';
import type { PlaceRenderer } from '@/renderer/placeRenderer';
import type { UserRenderer } from '@/renderer/userRenderer';

export const rendererState = reactive({
  chunkProgress: 0,
  loadedChunks: 0,
  selectedColors: ([] as boolean[]).fill(true),
  isRunning: false
});

export const placeRenderer = ref<PlaceRenderer>();
export const userRenderer = ref<UserRenderer>();

export const timelineState = reactive({
  changed: false
});

export const userPixels = new Map<string, number[][]>();
export const selectedUsers = reactive(new Set<string>());
