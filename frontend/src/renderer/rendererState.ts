import { reactive } from 'vue';

export enum VISUALIZATION_MODE {
  PIXEL,
  HEATMAP
}


export const rendererState = reactive({
  timePercentage: 0,
  timePercentageChanged: false,
  mode: VISUALIZATION_MODE.PIXEL
})