import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  menuItems = [
    {
      section: 'main',
      items: [
        { label: 'Dashboard', icon: 'home', route: '/admin/dashboard' },
        { label: 'Reports', icon: 'reports', route: '/admin/reports' },
        { label: 'Orders', icon: 'orders', route: '/admin/admin-orders' },
        { label: 'Inventory', icon: 'inventory', route: '/admin/medicine' },
        { label: 'Payments', icon: 'payments', route: '/admin/payments' },
        { label: 'Customers', icon: 'customers', route: '/admin/customers' },
        {
          label: 'Notifications',
          icon: 'notifications',
          badge: 7,
          route: '/admin/notifications',
        },
      ],
    },

    {
      section: 'secondary',
      items: [
        { label: 'Help & Support', icon: 'help', route: '/admin/help' },
        { label: 'Settings', icon: 'settings', route: '/admin/settings' },
      ],
    },
  ];

}
