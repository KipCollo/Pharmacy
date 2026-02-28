import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ChartConfiguration, ChartData} from "chart.js";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent{


  // customers = [
  //   { initials: 'BR', name: 'Bailee Ryan', email: 'bailee@example.com', phone: '+46170949889', location: 'China', totalSpent: 175.00 },
  //   { initials: 'GK', name: 'Gage Kovacek', email: 'gage@example.com', phone: '+036214956433', location: 'Russia', totalSpent: 250.00 },
  //   { initials: 'AH', name: 'Albina Haag', email: 'albina@example.com', phone: '+568214270433', location: 'Aruba', totalSpent: 165.00 },
  //   { initials: 'JY', name: 'Jemar Yunet', email: 'jemar@example.com', phone: '+90307801543', location: 'Côte d’Ivoire', totalSpent: 300.00 }
  // ];

  // Chart.js Configuration
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true
  };

  // Order Trend Chart Data
  orderChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  orderChartData = [{ data: [20, 35, 50, 65, 80], label: 'Orders' }];

  // Revenue Trend Chart Data
  revenueChartData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Revenue',
        data: [100, 200, 150, 300],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
      },
    ],
  };





}
