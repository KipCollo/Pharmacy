import { Component } from '@angular/core';
import {Chart, ChartData, ChartOptions, ChartType, registerables} from "chart.js";
import {BaseChartDirective} from "ng2-charts";

Chart.register(...registerables)
@Component({
  selector: 'app-cart-reports',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './cart-reports.component.html',
  styleUrl: './cart-reports.component.css'
})
export class CartReportsComponent {

  chartOptions: ChartOptions = {
    responsive: true,
  };

  chartType: ChartType = 'bar';

  // Data for charts
  cartsStartedData: ChartData<'bar'> = {
    labels: ['Carts Started'],
    datasets: [
      { data: [13], label: 'Started Carts', backgroundColor: 'blue' }
    ]
  };

  cartsAbandonedData: ChartData<'bar'> = {
    labels: ['Carts Abandoned'],
    datasets: [
      { data: [8], label: 'Abandoned Carts', backgroundColor: 'red' }
    ]
  };

  cartsPlacedData: ChartData<'bar'> = {
    labels: ['Carts Placed'],
    datasets: [
      { data: [5], label: 'Placed Carts', backgroundColor: 'green' }
    ]
  };

  cartsRecoveredData: ChartData<'bar'> = {
    labels: ['Carts Recovered'],
    datasets: [
      { data: [0], label: 'Recovered Carts', backgroundColor: 'purple' }
    ]
  };
}
