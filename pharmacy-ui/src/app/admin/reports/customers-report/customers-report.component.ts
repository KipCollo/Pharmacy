import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CustomersApIsService} from "../../../services/services/customers-ap-is.service";
import {BaseChartDirective} from "ng2-charts";
import {Chart, ChartData, ChartOptions, registerables} from "chart.js";
import {FormsModule} from "@angular/forms";

Chart.register(...registerables);

@Component({
  selector: 'app-customers-report',
  standalone: true,
  imports: [
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './customers-report.component.html',
  styleUrl: './customers-report.component.css'
})
export class CustomersReportComponent implements OnInit{

  filterType: 'week' | 'month' | 'year' = 'week';

  customerData: { date: string, customers: number }[] = [];

  chart: any;

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'New Customers',
        data: [],
        backgroundColor: 'rgba(37, 99, 235, 0.3)',
        borderColor: '#2563EB',
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  ngOnInit() {
    this.generateCustomerData();
    this.updateChart();
  }

  /** Generate random data based on selected filter */
  generateCustomerData() {
    const today = new Date();
    const data: { date: string, customers: number }[] = [];

    if (this.filterType === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        data.push({ date: date.toISOString().split('T')[0], customers: this.randomCustomers() });
      }
    } else if (this.filterType === 'month') {
      // Every 3 days in current month
      const month = today.getMonth();
      const year = today.getFullYear();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let d = 1; d <= daysInMonth; d += 3) {
        const date = new Date(year, month, d);
        data.push({ date: date.toISOString().split('T')[0], customers: this.randomCustomers() });
      }
    } else if (this.filterType === 'year') {
      // Every month
      const year = today.getFullYear();
      for (let m = 0; m < 12; m++) {
        const date = new Date(year, m, 1);
        data.push({ date: date.toISOString().split('T')[0], customers: this.randomCustomers() });
      }
    }

    this.customerData = data;
  }

  /** Returns a random number of customers between 2 and 8 */
  randomCustomers() {
    return Math.floor(Math.random() * 7) + 2;
  }

  /** Update chart based on filtered data */
  updateChart() {
    this.generateCustomerData();

    this.chartData.labels = this.customerData.map(d => d.date);
    this.chartData.datasets[0].data = this.customerData.map(d => d.customers);
  }

  onFilterChange(newFilter: 'week' | 'month' | 'year') {
    this.filterType = newFilter;
    this.updateChart();
  }


}
