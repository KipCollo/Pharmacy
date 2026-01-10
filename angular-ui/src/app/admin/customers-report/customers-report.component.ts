import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CustomersApIsService} from "../../services/services/customers-ap-is.service";
import {BaseChartDirective} from "ng2-charts";
import {Chart} from "chart.js";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-customers-report',
  standalone: true,
  imports: [
    BaseChartDirective,
    FormsModule,
    MatLabel,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatInput,
    MatOption,
    MatSelect
  ],
  templateUrl: './customers-report.component.html',
  styleUrl: './customers-report.component.css'
})
export class CustomersReportComponent implements AfterViewInit{

  filterType: string = 'week'; // Default filter

  customerData = [
    { date: '2025-03-01', customers: 4 },
    { date: '2025-03-04', customers: 5 },
    { date: '2025-03-07', customers: 3 },
    { date: '2025-03-10', customers: 6 },
    { date: '2025-03-13', customers: 4 },
    { date: '2025-03-16', customers: 5 },
  ];

  chart: any;

  ngAfterViewInit() {
    this.loadChart();
  }

  filterData() {
    let filteredData = this.getFilteredData();
    this.updateChart(filteredData);
  }

  loadChart() {
    this.chart = new Chart('customerChart', {
      type: 'bar',
      data: {
        labels: this.customerData.map(d => d.date),
        datasets: [{
          label: 'New Customers',
          data: this.customerData.map(d => d.customers),
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.3)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  updateChart(filteredData: any[]) {
    this.chart.data.labels = filteredData.map(d => d.date);
    this.chart.data.datasets[0].data = filteredData.map(d => d.customers);
    this.chart.update();
  }

  getFilteredData() {
    const today = new Date();
    return this.customerData.filter(data => {
      const dataDate = new Date(data.date);
      if (this.filterType === 'week') {
        let oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return dataDate >= oneWeekAgo;
      } else if (this.filterType === 'month') {
        return dataDate.getMonth() === today.getMonth() && dataDate.getFullYear() === today.getFullYear();
      } else if (this.filterType === 'year') {
        return dataDate.getFullYear() === today.getFullYear();
      }
      return true;
    });
  }

  // renderChart() {
  //   const ctx = document.getElementById('customerChart') as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: ['March 1', 'March 4', 'March 7', 'March 10', 'March 13', 'March 16'],
  //       datasets: [
  //         {
  //           type: 'line',
  //           label: 'New Customers',
  //           data: [4, 5, 3, 6, 4, 5],
  //           borderColor: '#2563EB',
  //           borderWidth: 2,
  //           fill: false,
  //           pointBackgroundColor: '#2563EB',
  //           pointBorderColor: '#2563EB'
  //         },
  //         {
  //           type: 'bar',
  //           label: 'Total Customers',
  //           data: [4, 5, 3, 6, 4, 5],
  //           backgroundColor: 'rgba(37, 99, 235, 0.3)'
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           display: true
  //         }
  //       }
  //     }
  //   });
  // }

}
