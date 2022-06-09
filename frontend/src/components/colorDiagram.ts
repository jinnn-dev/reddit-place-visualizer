import type { ECharts } from 'echarts';
import { init } from 'echarts';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { pixelColorsHex } from '@/model/colorMapping';
import { colorTooltip } from '@/components/tooltip';

interface ChartItem {
  name: string;
  value: number;
  itemStyle: { color: string };
}

export class ColorDiagram {
  chart: ECharts | undefined;
  options: ECBasicOption;

  chartItems!: ChartItem[];
  backUpChartItems!: ChartItem[];

  constructor(elementId: string) {
    const element = document.getElementById(elementId);
    if (element === null) {
      throw new Error(`Could not find element with id ${elementId}`);
    }
    this.options = {};
    this.initChart(element);
    this.initChartItems();

    const resizeCallback = () => {
      this.chart!.resize();
    };

    if (element.parentElement !== null) {
      new ResizeObserver(resizeCallback).observe(element.parentElement);
    }
  }

  initChart(element: HTMLElement) {
    this.chart = init(element, 'dark', { renderer: 'svg' });
    this.options = {
      title: {
        text: 'Color Distribution',
        left: 'center'
      },
      backgroundColor: 'transparent',
      tooltip: colorTooltip,
      series: [
        {
          type: 'pie',
          data: this.chartItems,
          radius: '85%',
          center: ['50%', '52%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],

      animationDuration: 200,
      animationDurationUpdate: 200
    };
    this.chart.setOption(this.options);

    setInterval(() => {
      // @ts-ignore
      this.options.series[0].data = this.chartItems;
      this.chart?.setOption({
        series: {
          data: this.chartItems
        }
      });
    }, 300);
  }

  private initChartItems() {
    this.chartItems = [];
    for (let i = 0; i < pixelColorsHex.length; i++) {
      this.chartItems.push({
        name: pixelColorsHex[i],
        value: -1,
        itemStyle: {
          color: pixelColorsHex[i]
        }
      });
    }

    this.backUpChartItems = this.chartItems.map((item) => item);
  }

  updateSelectedColors(selectedIndex: number, enabled: number): void {
    if (enabled) {
      this.chartItems.push(this.backUpChartItems[selectedIndex]);
    } else {
      const index = this.chartItems.findIndex((item) => item.name === pixelColorsHex[selectedIndex]);
      this.chartItems.splice(index, 1);
    }
  }

  toggleAllColors(visible: boolean) {
    if (visible) {
      this.chartItems = this.backUpChartItems;
    } else {
      this.chartItems = [];
    }
  }

  updateData(data: Uint32Array) {
    for (let i = 0; i < this.chartItems.length; i++) {
      const currentChartItem = this.chartItems[i];
      const index = pixelColorsHex.indexOf(currentChartItem.name);
      this.chartItems[i].value = data[index];
      this.backUpChartItems[index].value = data[index];
    }
  }
}
