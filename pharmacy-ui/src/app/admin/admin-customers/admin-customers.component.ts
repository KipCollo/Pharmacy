import { Component, OnInit, inject } from '@angular/core';
import { UserResponse } from "../../services/models/user-response";
import { CustomersApIsService } from "../../services/services/customers-ap-is.service";
import { OrderApIsService } from "../../services/services/order-ap-is.service";
import { OrderResponse } from "../../services/models/order-response";
import { ChartConfiguration } from "chart.js";
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe, NgClass, NgIf, NgFor, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CurrencyPipe,
    NgClass,
    NgIf,
    NgFor,
    SlicePipe
  ],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent implements OnInit {
  private userService = inject(CustomersApIsService);
  private orderService = inject(OrderApIsService);

  customers: Array<UserResponse> = [];
  totalCustomers: number = 0;
  totalRevenue: number = 0;
  averageLTV: number = 0;
  searchTerm = '';
  selectedCustomer: UserResponse | null = null;
  isPreviewOpen = false;
  openActionMenuId: number | null = null;
  sortKey: 'name' | 'email' | 'phone' | 'location' | 'roles' | 'created' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedCustomerKeys = new Set<string>();
  customerOrders: OrderResponse[] = [];
  loadingOrders = false;

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

  ngOnInit() {
    this.getUsers();
  }

  // Customers Data
  getUsers() {
    this.userService.getAllCustomers().subscribe(
      users => {
        this.customers = users;
        this.calculateAnalytics();

        if (this.customers.length > 0 && !this.selectedCustomer) {
          this.selectedCustomer = this.customers[0];
        }
      }, (error) => {
        console.error('Error fetching users data:', error);
      }
    );
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

  getAvatar(customer: UserResponse): string {
    const fullName = `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim();
    const name = fullName || customer.email || 'Customer';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8EEF4&color=103A59`;
  }

  formatRoleNames(customer: UserResponse): string {
    if (!customer.roles?.length) {
      return 'Customer';
    }

    return customer.roles
      .map((role) => role.name || 'User')
      .join(', ');
  }

  getRoleBadgeClass(roleName?: string): string {
    const baseClass = 'rounded-full px-2.5 py-1 text-[0.72rem] font-bold tracking-[0.03em]';

    switch ((roleName || '').toUpperCase()) {
      case 'ADMIN':
        return `${baseClass} bg-rose-100 text-rose-700`;
      case 'DOCTOR':
        return `${baseClass} bg-sky-100 text-sky-700`;
      case 'USER':
        return `${baseClass} bg-emerald-100 text-emerald-700`;
      default:
        return `${baseClass} bg-slate-100 text-slate-600`;
    }
  }

  formatDate(dateValue?: string): string {
    if (!dateValue) {
      return 'N/A';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString();
  }

  formatDateTime(dateValue?: string): string {
    if (!dateValue) {
      return 'N/A';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString();
  }

  getFullName(customer: UserResponse | null): string {
    if (!customer) {
      return 'Select a customer';
    }

    const fullName = `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim();
    return fullName || 'Customer';
  }

  getFilteredCustomers(): Array<UserResponse> {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = !term
      ? [...this.customers]
      : this.customers.filter((c) =>
        (`${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase().includes(term)) ||
        (c.email ?? '').toLowerCase().includes(term) ||
        (c.phone ?? '').toLowerCase().includes(term) ||
        (c.location ?? '').toLowerCase().includes(term)
      );

    const direction = this.sortDirection === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      const valueA = this.getSortValue(a, this.sortKey);
      const valueB = this.getSortValue(b, this.sortKey);

      if (valueA < valueB) {
        return -1 * direction;
      }

      if (valueA > valueB) {
        return 1 * direction;
      }

      return 0;
    });

    return filtered;
  }

  openCustomerPreview(customer: UserResponse) {
    this.selectedCustomer = customer;
    this.isPreviewOpen = true;
    this.openActionMenuId = null;
    this.loadCustomerOrders(customer);
  }

  private loadCustomerOrders(customer: UserResponse) {
    this.loadingOrders = true;
    this.customerOrders = [];

    this.orderService.findAll().subscribe({
      next: (orders) => {
        this.customerOrders = (orders || []).filter(
          order => order.customers?.customerId === customer.customerId
        );
        this.loadingOrders = false;
      },
      error: () => {
        this.loadingOrders = false;
      }
    });
  }

  isCustomerSelected(customer: UserResponse): boolean {
    return this.selectedCustomerKeys.has(this.getSelectionKey(customer));
  }

  toggleCustomerSelection(customer: UserResponse, checked: boolean) {
    const key = this.getSelectionKey(customer);

    if (checked) {
      this.selectedCustomerKeys.add(key);
      return;
    }

    this.selectedCustomerKeys.delete(key);
  }

  toggleSelectAllVisible(checked: boolean) {
    const visibleCustomers = this.getFilteredCustomers();

    for (const customer of visibleCustomers) {
      const key = this.getSelectionKey(customer);
      if (checked) {
        this.selectedCustomerKeys.add(key);
      } else {
        this.selectedCustomerKeys.delete(key);
      }
    }
  }

  areAllVisibleSelected(): boolean {
    const visibleCustomers = this.getFilteredCustomers();

    if (!visibleCustomers.length) {
      return false;
    }

    return visibleCustomers.every((customer) => this.selectedCustomerKeys.has(this.getSelectionKey(customer)));
  }

  isSomeVisibleSelected(): boolean {
    const visibleCustomers = this.getFilteredCustomers();

    if (!visibleCustomers.length) {
      return false;
    }

    const selectedVisibleCount = visibleCustomers.filter(
      (customer) => this.selectedCustomerKeys.has(this.getSelectionKey(customer))
    ).length;

    return selectedVisibleCount > 0 && selectedVisibleCount < visibleCustomers.length;
  }

  closePreview() {
    this.isPreviewOpen = false;
    this.closeActionMenu();
  }

  toggleSort(key: 'name' | 'email' | 'phone' | 'location' | 'roles' | 'created') {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.sortKey = key;
    this.sortDirection = 'asc';
  }

  getSortIcon(key: 'name' | 'email' | 'phone' | 'location' | 'roles' | 'created'): string {
    if (this.sortKey !== key) {
      return '↕';
    }

    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  toggleActionMenu(customerId?: number) {
    if (!customerId) {
      return;
    }

    this.openActionMenuId = this.openActionMenuId === customerId ? null : customerId;
  }

  closeActionMenu() {
    this.openActionMenuId = null;
  }

  viewCustomer(customer: UserResponse) {
    this.selectedCustomer = customer;
    this.isPreviewOpen = true;
    this.closeActionMenu();
  }

  deactivateCustomer(customer: UserResponse) {
    console.info('Deactivate customer selected:', customer.customerId);
    this.closeActionMenu();
  }

  resetCustomerPassword(customer: UserResponse) {
    console.info('Reset password selected:', customer.customerId);
    this.closeActionMenu();
  }

  private getSortValue(customer: UserResponse, key: 'name' | 'email' | 'phone' | 'location' | 'roles' | 'created'): string | number {
    switch (key) {
      case 'name':
        return `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim().toLowerCase();
      case 'email':
        return (customer.email ?? '').toLowerCase();
      case 'phone':
        return (customer.phone ?? '').toLowerCase();
      case 'location':
        return (customer.location ?? '').toLowerCase();
      case 'roles':
        return this.formatRoleNames(customer).toLowerCase();
      case 'created': {
        const timestamp = customer.createdDate ? new Date(customer.createdDate).getTime() : 0;
        return Number.isNaN(timestamp) ? 0 : timestamp;
      }
      default:
        return '';
    }
  }

  private getSelectionKey(customer: UserResponse): string {
    if (customer.customerId != null) {
      return `id:${customer.customerId}`;
    }

    if (customer.email) {
      return `email:${customer.email.toLowerCase()}`;
    }

    return `name:${(customer.firstName ?? '').toLowerCase()}_${(customer.lastName ?? '').toLowerCase()}`;
  }

  getOrderStatusClass(status?: string): string {
    const baseClass = 'rounded-full px-2 py-1 text-[0.7rem] font-semibold';
    switch (status) {
      case 'APPROVED':
        return `${baseClass} bg-green-100 text-green-700`;
      case 'DELIVERED':
        return `${baseClass} bg-emerald-100 text-emerald-700`;
      case 'PREPARING':
        return `${baseClass} bg-yellow-100 text-yellow-700`;
      case 'DISPATCHED':
        return `${baseClass} bg-blue-100 text-blue-700`;
      case 'CANCELED':
        return `${baseClass} bg-red-100 text-red-700`;
      case 'PENDING':
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  }

}
