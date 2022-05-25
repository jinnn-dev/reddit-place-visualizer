import * as echarts from 'echarts'
import { parse } from 'papaparse';
import { pixelColors } from '@/model/colorMapping';
import { rgb } from 'chroma-js';


export class ActivityDiagram {
  position: number
  chart!: echarts.ECharts;

  constructor(elementId: string) {
    this.position = 0;
    const element = document.getElementById(elementId);
    if (element === null) {
      throw new Error();
    }

    parse("https://pdyn.de/place/place_activity_stats.csv", {
      download: true,
      delimiter: ";",
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        console.log(results.data);
        this.initChart(element, results.data);
      }
    });


  }



  initChart(element: HTMLElement, data) {
    let metadata = {
      line: [],
      activity: [],
      total_activity: []
    }
    while (metadata.activity.push([]) < 32);
    for (let i = 0; i < data.length; i++) {
      if (data[i]["line"] == undefined) {
        console.log("Reached end of file after " + i + " lines");
        break;
      }

      let color_activity;
      try {
        color_activity = JSON.parse(data[i]["changes_by_color"]);
      } catch (error) {
        console.log("Error");
        console.log(data[i])
        color_activity = {}
        break;
      }

      metadata.line.push(data[i]["line"]);
      metadata.total_activity.push(data[i]["changes_total"]);
      //console.log("Line: " + data[i]["line"]);
      //console.log(color_activity);
      //console.log("Array before: " + metadata.activity);
      for (let j = 0; j < 32; j++) {
        let c = color_activity[j];
        if (c == undefined) {
          c = 0;
        }
        metadata.activity[j].push(c);
        //console.log(j, c, metadata.activity);
      }
      //break;
    }
    // Initialize the echarts instance based on the prepared dom
    this.chart = echarts.init(element, undefined, { renderer: 'svg' });

    // Specify the configuration items and data for the chart
    let option = {
      title: {
        text: ''
      },
      tooltip: {

      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
        }
      },
      legend: {
        data: []
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      xAxis: {
        data: metadata.line,
        type: 'value',
        boundaryGap: true,
      },
      yAxis: {
        type: 'value',
        min: 1
      },
      series: [
      ],

    };
    for (let i = 0; i < 32; i++) {
      let series = {
        name: 'activity' + i,
        type: 'line',
        stack: 'Total',
        markLine: {
          data: [[
            { name: 'start', xAxis: 2000, yAxis: 0 },
            { name: 'end', xAxis: 2000, yAxis: 1 },
          ]]
        },
        data: metadata.activity[i],
        smooth: false,
        lineStyle: {
          width: 0.0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 1,
          color: "rgb(" + pixelColors[i][0] + "," + pixelColors[i][1] + "," + pixelColors[i][2] + ")"
        },
        emphasis: {
          focus: 'series'
        }
      }
      option.series.push(series);
    }
    console.log(option);
    console.log(metadata.activity)
    // Display the chart using the configuration items and data just specified.
    this.chart.setOption(option);
  }


  updatePosition(value: any): void {
    this.position = value;
  }
}
