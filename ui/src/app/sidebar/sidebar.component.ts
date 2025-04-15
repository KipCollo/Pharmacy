import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  // These values should ideally come from your backend service
  profileImage: string | null = null; // Will be null if no profile image is set
  userName: string = 'John Doe'; // Default user name
  userRole: string = 'User'; // Default role (e.g., User, Admin)

  profileDropdownOpen: boolean = false;

  // Method to toggle the profile dropdown visibility
  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  // Log out method (replace with actual logout logic)
  logout() {
    // Perform logout logic here, e.g., clearing the session or token
    console.log('Logged out');
  }

  menuItems = [
    { name: 'Dashboard', link: '/admin/dashboard', icon: '📊', subMenu: [], isOpen: false },
    { name: 'Reports', link: '/admin/reports', icon: '📄', subMenu: [], isOpen: false },
    { name: 'Orders', link: '/admin/admin-orders', icon: '🛍️', subMenu: [], isOpen: false },
    { name: 'Subscriptions', link: '/admin/subscriptions', icon: '💳', subMenu: [], isOpen: false },
    { name: 'Customers', link: '/admin/customers', icon: '👥', subMenu: [], isOpen: false },
    { name: 'Products', link: '/product', icon: '💊', subMenu: [], isOpen: false },
    { name: 'Cart',link: '/admin/cart-reports', icon: '🛒', isOpen: false}
  ];

  toggleSubMenu(item: any) {
    item.isOpen = !item.isOpen;
  }
}
