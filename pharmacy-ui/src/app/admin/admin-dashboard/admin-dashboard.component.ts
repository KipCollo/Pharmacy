import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ChartConfiguration, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    BaseChartDirective,
    NgClass
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminPanelComponent {

  // Net Revenue Line Chart
  public revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [100, 200, 150, 300, 250, 400], label: 'Net Revenue' }]
  };
  public revenueChartType: ChartType = 'line';
  //public isRevenueUp = this.checkTrend(this.revenueChartData.datasets[0].data);

  // Profit Pie Chart
  public profitChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Profit', 'Loss'],
    datasets: [{ data: [67.2, 32.8] }]
  };
  public profitChartType: ChartType = 'pie';
  public isProfitUp = this.checkTrend(this.profitChartData.datasets[0].data);

  // Orders Bar Chart
  public ordersChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [500, 600, 750, 900, 850, 1000], label: 'Orders' }]
  };
  public ordersChartType: ChartType = 'bar';
  public isOrdersUp = this.checkTrend(this.ordersChartData.datasets[0].data);

  // Carts Radar Chart
  public cartsChartData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [200, 300, 250, 350, 400, 450], label: 'Carts' }]
  };
  public cartsChartType: ChartType = 'radar';
  public isCartsUp = this.checkTrend(this.cartsChartData.datasets[0].data);

  // Customers Doughnut Chart
  public customersChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Active', 'Inactive'],
    datasets: [{ data: [80, 20] }]
  };
  public customersChartType: ChartType = 'doughnut';
  public isCustomersUp = this.checkTrend(this.customersChartData.datasets[0].data);

  // New Medicine Arrivals Bar Chart
  public medicineArrivalsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [20, 35, 30, 45, 40, 50], label: 'New Arrivals' }]
  };
  public medicineArrivalsChartType: ChartType = 'bar';
  public isMedicineArrivalsUp = this.checkTrend(this.medicineArrivalsChartData.datasets[0].data);

  constructor() {}

  // Method to check trend
  checkTrend(data: (number | [number, number] | null | { y: number })[]): boolean {
    // Filter out null and handle Point objects and [number, number] tuples
    const validData = data.filter((value): value is number => {
      // Ensure value is a number (not null or Point or [number, number])
      if (value === null) return false;
      if (typeof value === 'number') return true;
      if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
        return true;
      }
      if ((value as any).y !== undefined) {
        return typeof (value as any).y === 'number';
      }
      return false;
    }).map(value => {
      // Return the value, ensuring we get the correct number if it's a tuple or a Point
      if (Array.isArray(value)) {
        return value[1]; // Use the second number in the tuple [x, y]
      } else if (typeof value === 'number') {
        return value;
      } else {
        return (value as any).y; // Extract the y value if it's a Point
      }
    });

    // Ensure there are at least two data points to compare
    if (validData.length < 2) {
      return false; // Cannot determine trend if less than 2 valid points
    }

    const last = validData[validData.length - 1];
    const previous = validData[validData.length - 2];

    return last > previous;
  }
}
