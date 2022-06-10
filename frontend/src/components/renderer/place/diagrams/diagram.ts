import type { ECharts } from 'echarts';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import type { ParsedStatsLine } from '@/lib/activityStatisticParser';

export abstract class Diagram {
  chart: ECharts | undefined;
  options!: ECBasicOption;

  abstract initChart(element: HTMLElement, data: Array<ParsedStatsLine>): void;
  abstract updateSelectedColors(selectedIndex: number, enable: number): void;
  abstract toggleAllColors(visible: boolean): void;
}
