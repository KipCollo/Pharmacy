import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { CustomerReportResponse } from '../../../services/models/customer-report-response';
import { CustomersApIsService } from '../../../services/services/customers-ap-is.service';

type ReportPeriod = 'day' | 'week' | 'month';

@Component({
  selector: 'app-customers-report',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './customers-report.component.html',
  styleUrl: './customers-report.component.css'
})
export class CustomersReportComponent {
  private readonly customersService = inject(CustomersApIsService);

  selectedPeriod = signal<ReportPeriod>('month');
  dateRangeDisplay = '';
  isLoading = false;

  // Chart Configuration
  chartType: 'line' = 'line';
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      filler: { propagate: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 200,
        ticks: { color: '#9ca3af' },
        grid: { color: '#e5e7eb' }
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { display: false }
      }
    }
  };

  customerChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Customers',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }
    ]
  };

  constructor() {
    this.loadReport();
  }

  get totalCustomers(): number {
    return (this.customerChartData.datasets[0].data as number[]).reduce((sum, value) => sum + value, 0);
  }

  get averageCustomers(): number {
    const values = this.customerChartData.datasets[0].data as number[];
    if (values.length === 0) {
      return 0;
    }
    return this.totalCustomers / values.length;
  }

  setPeriod(period: ReportPeriod): void {
    this.selectedPeriod.set(period);
    this.loadReport();
  }

  async exportCsv(): Promise<void> {
    const Papa = await import('papaparse');
    const labels = this.customerChartData.labels ?? [];
    const values = this.customerChartData.datasets[0].data as number[];

    const csv = Papa.unparse(
      labels.map((label, index) => ({
        date: label,
        customers: values[index] ?? 0
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_report_${this.selectedPeriod()}.csv`;
    link.click();
  }

  private loadReport(): void {
    this.isLoading = true;
    const period = this.selectedPeriod();

    this.customersService
      .getCustomerReport({ period })
      .subscribe({
        next: (report) => {
          const labels = report.map((entry) => this.formatDateLabel(entry.date ?? '', period));
          const values = report.map((entry) => entry.customers ?? 0);
          this.customerChartData = {
            ...this.customerChartData,
            labels,
            datasets: [
              {
                ...this.customerChartData.datasets[0],
                data: values
              }
            ]
          };
          this.dateRangeDisplay = this.buildDateRangeDisplay(labels);
          this.isLoading = false;
        },
        error: () => {
          this.customerChartData = {
            ...this.customerChartData,
            labels: [],
            datasets: [{ ...this.customerChartData.datasets[0], data: [] }]
          };
          this.dateRangeDisplay = 'No data available';
          this.isLoading = false;
        }
      });
  }

  private formatDateLabel(value: string, period: ReportPeriod): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    if (period === 'day') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  private buildDateRangeDisplay(labels: string[]): string {
    if (labels.length === 0) {
      return 'No data available';
    }
    if (labels.length === 1) {
      return labels[0];
    }
    return `${labels[0]} - ${labels[labels.length - 1]}`;
  }
}
