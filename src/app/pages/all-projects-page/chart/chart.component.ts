import {Component, OnInit} from '@angular/core';
import {EChartsOption} from "echarts";
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit{

  ngOnInit(): void {
    const chartDom = document.getElementById('chart')!;
    const myChart = echarts.init(chartDom);
    let option: EChartsOption;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        padding: -1,
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          color: ['#8C92AC', '#49416D', '#DFD9E2', '#736B92', '#7D5C65'],
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1, name: 'C#' },
            { value: 1, name: 'JavaScript' },
            { value: 1, name: 'Python' },
            { value: 1, name: 'Java' },
            { value: 1, name: 'PHP' }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }
}
