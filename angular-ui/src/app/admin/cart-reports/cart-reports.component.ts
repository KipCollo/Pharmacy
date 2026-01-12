import {Component, OnInit} from '@angular/core';
import {Chart, ChartData, ChartOptions, ChartType, registerables} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import { CartControllerService } from '../../services/services';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
export class CartReportsComponent implements OnInit{

  cartsStartedData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };
  cartsAbandonedData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };
  cartsPlacedData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };
  cartsRecoveredData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };

  constructor(private cartService: CartControllerService) {}



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

  ngOnInit(): void {
    this.fetchCartStatusData();
  }

  fetchCartStatusData(): void {
    const statuses: ('STARTED' | 'CHECKED_OUT' | 'ABANDONED' | 'REMOVED')[] =
      ['STARTED', 'CHECKED_OUT', 'ABANDONED', 'REMOVED'];

    const requests = statuses.map(status =>
      this.cartService.getCartsByStatus({ status }).toPromise()
    );

    Promise.all(requests)
      .then(responses => {
        const [started, checkedOut, abandoned, removed] = responses;

        this.cartsStartedData.datasets[0].data = [started?.length ?? 0];
        this.cartsPlacedData.datasets[0].data = [checkedOut?.length ?? 0];
        this.cartsAbandonedData.datasets[0].data = [abandoned?.length ?? 0];
        this.cartsRecoveredData.datasets[0].data = [removed?.length ?? 0];
      })
      .catch(error => {
        console.error('Error fetching cart statuses:', error);
      });
  }

}
