import {Injectable} from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle
} from "ng-apexcharts";
import {DashboardNameValueItem} from "../../interfaces/admin/dashboard/dashboard-name-value-item.interface";

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  fill: ApexFill,
  title: ApexTitleSubtitle,
};

export type AreaChartOptions = {
  series: any;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: any;
  dataLabels: ApexDataLabels;
  fill: ApexFill,
  xaxis: any,
  yaxis: any,
  tooltip: any;
  title: ApexTitleSubtitle,
};

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private colors = ["#e5c8e5", "#b583c9", "#9358ac", "#dda8da", "#c87dd6", "#9d71c9"]

  constructor() {
  }

  public initPieChart(data: DashboardNameValueItem<string, number>[]): Partial<PieChartOptions> {
    return {
      series: data.map(item => item.value),
      chart: {
        width: 380,
        type: "pie"
      },
      labels: data.map(item => item.name),
      dataLabels: {
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex]
        },
      },
      fill: {
        colors: this.colors
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  public initAreaChart(data: DashboardNameValueItem<string, number>[]): Partial<AreaChartOptions> {
    return {
      series: [{
        name: 'Count',
        data: data.map(item => item.value),
      }],
      chart: {
        height: 350,
        width: '75%',
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      fill: {
        colors: this.colors
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: data.map(item => item.name),
      },
      yaxis: {
        min: 0,
        max: 15,
        stepSize: 5,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
        theme:  'dark',
      },
    };
  }
}
