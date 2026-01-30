import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  menuItems = [
    {
      name: 'Reports',
      icon: 'fas fa-chart-line',
      subMenu: [
        { name: 'Revenue', link: '/admin/reports/revenue' },
        { name: 'Profit', link: '/admin/reports/profit' },
        { name: 'Orders', link: '/admin/reports/orders' },
        { name: 'Refunds', link: '/admin/reports/refunds' },
        { name: 'Devices', link: '/admin/reports/devices' },
        { name: 'Sources', link: '/admin/reports/sources' },
        { name: 'Forecast', link: '/admin/reports/forecast' }
      ],
      isOpen: false // Track open state
     }
  ];

  toggleSubMenu(item: any) {
    item.isOpen = !item.isOpen; // Toggle the submenu visibility
  }

}
