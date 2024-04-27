import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import {TechnologyService} from "../../../shared/services/technology.service";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor(private technologyService: TechnologyService) { }

  ngOnInit(): void {
    const chartDom = document.getElementById('chart')!;
    const myChart = echarts.init(chartDom);
    let option: EChartsOption;

    this.technologyService.getTechnologyStatisticByProjects().subscribe((data) => {
      const chartData = data.map(item => ({ value: item.count, name: item.technology }));

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
            name: 'Tech Stack',
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
            data: chartData
          }
        ]
      };

      option && myChart.setOption(option);
    });
  }
}
