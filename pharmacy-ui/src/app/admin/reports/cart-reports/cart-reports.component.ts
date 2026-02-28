import { Component, OnInit, inject } from '@angular/core';
import {Chart, ChartData, ChartOptions, ChartType, registerables} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import { CartControllerService } from '../../../services/services';
import { forkJoin } from 'rxjs'
import {map} from "rxjs/operators";

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
export class CartReportsComponent implements OnInit{
  private cartService = inject(CartControllerService);


  chartType: 'bar' = 'bar';
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Cart Status Report' }
    },
    scales: {
      x: { stacked: false },
      y: { stacked: false, beginAtZero: true }
    }
  };

  cartsStartedData: ChartData<'bar'> = { labels: ['Carts'], datasets: [{ data: [0], label: 'Started' }] };
  cartsPlacedData: ChartData<'bar'> = { labels: ['Carts'], datasets: [{ data: [0], label: 'Placed' }] };
  cartsAbandonedData: ChartData<'bar'> = { labels: ['Carts'], datasets: [{ data: [0], label: 'Abandoned' }] };
  cartsRecoveredData: ChartData<'bar'> = { labels: ['Carts'], datasets: [{ data: [0], label: 'Removed' }] };

  ngOnInit(): void {
    this.fetchCartStatusData();
  }

  fetchCartStatusData(): void {
    const statuses: ('STARTED' | 'CHECKED_OUT' | 'ABANDONED' | 'REMOVED')[] =
      ['STARTED', 'CHECKED_OUT', 'ABANDONED', 'REMOVED'];

    const requests = statuses.map(status =>
      this.cartService.getCartsByStatus$Response({ status }).pipe(
        map(res => res.body ?? []) // Extract the array of CartResponse
      )
    );

    forkJoin(requests).subscribe({
      next: ([started, checkedOut, abandoned, removed]) => {
        this.cartsStartedData.datasets[0].data[0] = started.length;
        this.cartsPlacedData.datasets[0].data[0] = checkedOut.length;
        this.cartsAbandonedData.datasets[0].data[0] = abandoned.length;
        this.cartsRecoveredData.datasets[0].data[0] = removed.length;
      },
      error: (err) => console.error('Error fetching cart data:', err)
    });
  }

}
