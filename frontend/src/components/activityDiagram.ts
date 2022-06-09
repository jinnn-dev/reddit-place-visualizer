import type { ECharts, SeriesOption } from 'echarts';
import { init } from 'echarts';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { parse } from 'papaparse';
import { pixelColors } from '@/model/colorMapping';

type ParsedStatsLine = {
  [key: string]: any;
};

export class ActivityDiagram {
  position: number;
  chart: ECharts | undefined;
  metadata!: any;
  options: ECBasicOption;
  series: Array<SeriesOption>;

  constructor(elementId: string) {
    this.position = 0;
    const element = document.getElementById(elementId);
    this.options = {};
    this.series = [];
    if (element === null) {
      throw new Error();
    }

    // Download Activity Stats and create chart if successful
    parse('https://pdyn.de/place/place_activity_stats.csv', {
      download: true,
      delimiter: ';',
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        //console.log(results.data);
        this.initChart(element, results.data as Array<ParsedStatsLine>);
      }
    });

    // Create and attach reseize listener for resizableContainer
    const resizeCallback = () => {
      this.chart?.resize();
    };
    if (element.parentElement !== null) {
      new ResizeObserver(resizeCallback).observe(element.parentElement);
    }
  }

  createSeries(): void {
    this.series = [];
    for (let i = 0; i < 32; i++) {
      let series = {
        name: 'activity' + i,
        type: 'line',
        stack: 'Total',
        data: this.metadata.activity[i],
        smooth: false,
        lineStyle: {
          width: 0.0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 1,
          color: 'rgb(' + pixelColors[i][0] + ',' + pixelColors[i][1] + ',' + pixelColors[i][2] + ')'
        },
        emphasis: {
          focus: 'series'
        }
      };

      // @ts-ignore
      this.series.push(series);
    }

    let ml = {
      data: [
        [
          {
            name: '',
            xAxis: 6,
            yAxis: 1
          },
          {
            name: '',
            xAxis: 6,
            yAxis: 1.2e6
          }
        ]
      ],
      silent: true,
      symbol: []
    };
    this.series[0]['markLine'] = ml;
  }

  initChart(element: HTMLElement, data: Array<ParsedStatsLine>) {
    this.metadata = {
      line: [],
      activity: [],
      total_activity: []
    };
    while (this.metadata.activity.push([]) < 32);
    for (let i = 0; i < data.length; i++) {
      if (data[i]['line'] == undefined) {
        console.log('Reached end of file after ' + i + ' lines');
        break;
      }

      let color_activity;
      try {
        color_activity = JSON.parse(data[i]['changes_by_color']);
      } catch (error) {
        console.log('Error');
        console.log(data[i]);
        color_activity = {};
        break;
      }

      this.metadata.line.push(data[i]['line']);
      this.metadata.total_activity.push(data[i]['changes_total']);
      //console.log("Line: " + data[i]["line"]);
      //console.log(color_activity);
      //console.log("Array before: " + metadata.activity);
      for (let j = 0; j < 32; j++) {
        let c = color_activity[j];
        if (c == undefined) {
          c = 0;
        }
        this.metadata.activity[j].push(c);
        //console.log(j, c, metadata.activity);
      }
      //break;
    }
    // Initialize the echarts instance based on the prepared dom
    this.chart = init(element, 'dark', { renderer: 'svg' });

    // Specify the configuration items and data for the chart
    this.options = {
      title: {
        text: 'Color Activity',
        left: 'center'
      },
      backgroundColor: 'transparent',

      tooltip: {},

      legend: {
        data: []
      },
      dataZoom: [
        {
          name: 'dZoom',
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        data: this.metadata.line,
        type: 'category',
        boundaryGap: true
      },
      yAxis: {
        type: 'value',
        min: 1,
        axisLabel: {
          formatter: function (value: any) {
            let val = Math.abs(value);
            let stringRepresentation = val.toFixed(0);
            if (val >= 1000) {
              stringRepresentation = (val / 1000).toFixed(0) + ' K';
            }
            return stringRepresentation;
          }
        }
      },
      grid: {
        containLabel: true,
        left: 5,
        right: 10,
        bottom: 50
      },
      series: this.series
    };

    this.createSeries();

    // Display the chart using the configuration items and data just specified.
    this.chart.setOption(this.options);

    setInterval(() => {
      this.chart!.setOption({ series: this.series }, false, true);
    }, 300);
  }

  updatePosition(value: any): void {
    //let option = this.chart!.getOption();
    let pos = 0;
    //get x index for value
    for (let i = 0; i < this.metadata.line.length; i++) {
      if (this.metadata.line[i] > value) {
        pos = i;
        break;
      }
    }

    this.series[0]['markLine']['data'][0][0]['xAxis'] = pos;
    this.series[0]['markLine']['data'][0][1]['xAxis'] = pos;

    // Schedule update for markline
  }

  updateSelectedColors(selectedIndex: number, enabled: number): void {
    // @ts-ignore
    this.series[selectedIndex]['areaStyle']['opacity'] = enabled;
    // @ts-ignore
    this.series[selectedIndex]['stack'] = enabled ? 'Total' : '';
  }

  toggleAllColors(visible: boolean) {
    for (let i = 0; i < this.series.length; i++) {
      this.updateSelectedColors(i, visible ? 1 : 0);
    }
  }
}
