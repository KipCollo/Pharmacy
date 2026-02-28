import { Component, OnInit, signal, inject } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { CustomersApIsService } from '../../services/services';
import { UserResponse } from '../../services/models';
import {
  LucideAngularModule, Users, Home,
  BarChart2,
  Box,
  ShoppingCart,
  Archive,
  CreditCard,
  Bell,
  HelpCircle,
  Settings, MessageCircleQuestionMark, PillIcon,
} from "lucide-angular/src/icons";
import {House, icons} from "lucide-angular";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    RouterLinkActive,
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  private router = inject(Router);
  private customerService = inject(CustomersApIsService);


  currentUser: UserResponse = {};
  collapsed = signal(false);

  ngOnInit(): void {
    this.getUser();
    this.autoExpandActiveMenu();
  }

  profileDropdownOpen: boolean = false;

  // Method to toggle the profile dropdown visibility
  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  getUser(){
    this.customerService.getCurrentCustomer().subscribe({
      next: (user)=>{
        this.currentUser = user;
      },
      error: (err) =>console.log(err)
    })
  }

  getInitials(firstName: string | undefined, lastName: string | undefined): string {
    if (!firstName && !lastName) return 'N/A';
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  // Log out method (replace with actual logout logic)
  logout() {
    // Perform logout logic here, e.g., clearing the session or token
    console.log('Logged out');
  }

  toggle() {
    this.collapsed.update(v => !v);
  }


  menuItems = [
    {
      section: 'main',
      items: [
        { label: 'Dashboard', icon: House, route: '/admin/dashboard' },
        { label: 'Reports',
          icon: BarChart2,
          isOpen: false,
          route: '/admin/reports',
          children: [
            { label: 'Revenue', route: '/admin/reports/revenue' },
            { label: 'Profit', route: '/admin/reports/profit' },
            { label: 'Orders', route: '/admin/reports/orders' },
            { label: 'Refunds', route: '/admin/reports/refunds' },
            { label: 'Cart', route: '/admin/reports/carts' },
            { label: 'Customers', route: '/admin/reports/customers' },
            { label: 'Forecast', route: '/admin/reports/forecast' }
          ]},
        {
          label: 'Products',
          icon: Box,
          isOpen: false,
          route: '/admin/medicine',
          children: [
            { label: 'Categories', route: '/admin/medicine/categories' },
          ]
        },
        { label: 'Prescriptions', icon: PillIcon, route: '/admin/prescriptions'},
        { label: 'Orders', icon: ShoppingCart, route: '/admin/admin-orders' },
        { label: 'Inventory', icon: Archive, route: '/admin/inventory' },
        { label: 'Payments', icon: CreditCard, route: '/admin/payments' },
        { label: 'Customers', icon: Users, route: '/admin/customers' },
        { label: 'Notifications', icon: Bell, badge: 7, route: '/admin/notifications' },
      ],
    },
    {
      section: 'secondary',
      items: [
        { label: 'Help & Support', icon: MessageCircleQuestionMark, route: '/admin/help' },
        { label: 'Settings', icon: Settings, route: '/admin/settings' },
      ],
    },
  ];


  handleItemClick(clickedItem: any) {

    // Close other submenus
    this.menuItems.forEach(group => {
      group.items.forEach(item => {
        if (item !== clickedItem && item.children) {
          item.isOpen = false;
        }
      });
    });

    // Toggle submenu if exists
    if (clickedItem.children) {
      clickedItem.isOpen = !clickedItem.isOpen;
    }

    // Navigate
    if (clickedItem.route) {
      this.router.navigate([clickedItem.route]);
    }
  }

  autoExpandActiveMenu() {
    const currentUrl = this.router.url;

    this.menuItems.forEach(group => {
      group.items.forEach(item => {
        if (item.children?.some(c => currentUrl.startsWith(c.route))) {
          item.isOpen = true;
        } else {
          item.isOpen = false; // optional: collapse others
        }
      });
    });
  }

}
