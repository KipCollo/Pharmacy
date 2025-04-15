import { Component } from '@angular/core';
import {Chart, ChartData, ChartOptions, ChartType, registerables} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {SidebarComponent} from "../sidebar/sidebar.component";

Chart.register(...registerables)
@Component({
  selector: 'app-cart-reports',
  standalone: true,
    imports: [
        BaseChartDirective,
        SidebarComponent
    ],
  templateUrl: './cart-reports.component.html',
  styleUrl: './cart-reports.component.css'
})
export class CartReportsComponent {


  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Cart Status Report'
      }
    }
  };

  chartType: ChartType = 'bar';

  cartStatusChartData: ChartData<'bar'> = {
    labels: ['Started', 'Abandoned', 'Placed', 'Recovered'],
    datasets: [
      {
        label: 'Cart Statuses',
        data: [13, 8, 5, 0], // You can update these dynamically later
        backgroundColor: ['blue', 'red', 'green', 'purple']
      }
    ]
  };

  ngOnInit(): void {
    // Later you can fetch stats from backend here and update `cartStatusChartData.data`
  }
}
