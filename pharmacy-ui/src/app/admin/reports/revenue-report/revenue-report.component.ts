import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RevenueReportResponse } from '../../../services/models/revenue-report-response';
import { OrderApIsService } from '../../../services/services/order-ap-is.service';

type ReportPeriod = 'day' | 'week' | 'month';

@Component({
  selector: 'app-revenue-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-report.component.html',
  styleUrl: './revenue-report.component.css'
})
export class RevenueReportComponent {
  private readonly orderService = inject(OrderApIsService);

  selectedPeriod = signal<ReportPeriod>('week');
  isLoading = false;

  revenueRows: RevenueReportResponse[] = [];

  constructor() {
    this.loadReport();
  }

  get totalRevenue(): number {
    return this.revenueRows.reduce((sum, row) => sum + (row.revenue ?? 0), 0);
  }

  formatCurrency(value: number | undefined): string {
    return (value ?? 0).toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  setPeriod(period: ReportPeriod): void {
    this.selectedPeriod.set(period);
    this.loadReport();
  }

  async exportCsv(): Promise<void> {
    const Papa = await import('papaparse');
    const csv = Papa.unparse(
      this.revenueRows.map((row) => ({
        date: this.formatDateLabel(row.date ?? '', this.selectedPeriod()),
        revenue: row.revenue ?? 0
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `revenue_report_${this.selectedPeriod()}.csv`;
    link.click();
  }

  private loadReport(): void {
    this.isLoading = true;
    const period = this.selectedPeriod();

    this.orderService
      .getRevenueReport({ period })
      .subscribe({
        next: (report) => {
          this.revenueRows = report;
          this.isLoading = false;
        },
        error: () => {
          this.revenueRows = [];
          this.isLoading = false;
        }
      });
  }

  private formatDateLabel(value: string, period: ReportPeriod): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    if (period === 'day') {
      return date.toLocaleDateString();
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

}
