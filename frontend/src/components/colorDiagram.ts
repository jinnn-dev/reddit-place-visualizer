import type { ECharts } from 'echarts';
import { init } from 'echarts';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { pixelColors } from '@/model/colorMapping';

interface ChartItem {
  name: string;
  value: number;
}

export class ColorDiagram {
  chart: ECharts | undefined;
  options: ECBasicOption;

  chartItems!: ChartItem[];

  palette: string[] = [
    '#6D001A',
    '#BE0039',
    '#FF4500',
    '#FFA800',
    '#FFD635',
    '#FFF8B8',
    '#00A368',
    '#00CC78',
    '#7EED56',
    '#00756F',
    '#009EAA',
    '#00CCC0',
    '#2450A4',
    '#3690EA',
    '#51E9F4',
    '#493AC1',
    '#6A5CFF',
    '#94B3FF',
    '#811E9F',
    '#B44AC0',
    '#E4ABFF',
    '#DE107F',
    '#FF3881',
    '#FF99AA',
    '#6D482F',
    '#9C6926',
    '#FFB470',
    '#000000',
    '#515252',
    '#898D90',
    '#D4D7D9',
    '#FFFFFF'
  ];

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
      tooltip: {
        trigger: 'item'
      },

      series: [
        {
          type: 'pie',
          data: this.chartItems,
          animate: false,
          color: this.palette,
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
      animationDuration: 300,
      animationDurationUpdate: 300
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
    for (let i = 0; i < this.palette.length; i++) {
      this.chartItems.push({
        name: this.palette[i],
        value: 0
      });
    }
  }

  updateData(data: Uint32Array) {
    for (let i = 0; i < data.length; i++) {
      this.chartItems[i].value = data[i];
    }
  }
}
