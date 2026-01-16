import {Component, OnInit} from '@angular/core';
import {DatePipe, DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {UserResponse} from "../../services/models/user-response";
import {CustomersApIsService} from "../../services/services/customers-ap-is.service";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration} from "chart.js";
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    DecimalPipe,
    BaseChartDirective,
    DatePipe,
    FormsModule
  ],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent implements OnInit{

  customers: Array<UserResponse> = []
  totalCustomers: number = 0;
  totalRevenue: number = 0;
  averageLTV: number = 0;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 1500, 1800, 1200],
        backgroundColor: '#10b981'
      }
    ]
  };

  orderChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Orders',
        data: [30, 45, 60, 25],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.3
      }
    ]
  };



  constructor(private userService: CustomersApIsService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  // Customers Data
  getUsers(){
    this.userService.getAllCustomers().subscribe(
      users =>{
        this.customers = users
        this.calculateAnalytics()
      },(error) => {
        console.error('Error fetching users data:', error);
      }
    )
  }

  calculateAnalytics() {
    this.totalCustomers = this.customers.length;
    this.totalRevenue = this.customers.reduce((sum, c) => sum + (c.customerId || 0), 0);
    this.averageLTV = this.totalCustomers > 0 ? this.totalRevenue / this.totalCustomers : 0;
  }

  getInitials(firstName: string | undefined, lastName: string | undefined): string {
    if (!firstName && !lastName) return 'N/A';
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
  }


  searchTerm = '';
isPreviewOpen = false;
selectedCustomer: any = null;

filteredCustomers() {
  const term = this.searchTerm.toLowerCase();

  return this.customers.filter(c =>
    (c.firstName ?? '').toLowerCase().includes(term) ||
    (c.email ?? '').toLowerCase().includes(term)
  );
}


openCustomerPreview(customer: any) {
  this.selectedCustomer = customer;
  this.isPreviewOpen = true;
}



}
