import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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


constructor(private router: Router) {}

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
  { name: 'Dashboard', link: '/admin/dashboard', icon: '📊' },
  { name: 'Reports', link: '/admin/reports', icon: '📄' },
  { name: 'Orders', link: '/admin/admin-orders', icon: '🛍️' },
  { name: 'Subscriptions', link: '/admin/customers-report', icon: '💳' },
  { name: 'Customers', link: '/admin/customers', icon: '👥' },

  {
    name: 'Products',
    icon: '💊',
    isOpen: false,
    subMenu: [
      { name: 'All Products', link: '/admin/medicine', icon: '📦' },
      { name: 'Add Product', link: '/admin/medicine/add', icon: '➕' },
      { name: 'Expired Products', link: '/admin/medicine/expired', icon: '⏰' },
      { name: 'Out of Stock', link: '/admin/medicine/out-of-stock', icon: '🚫' }
    ]
  },

  { name: 'Cart', link: '/admin/cart-reports', icon: '🛒' }
];


onProductsClick(item: any) {
  // Navigate to ALL PRODUCTS first
  this.router.navigate(['/admin/medicine']);

  // Then open dropdown
  item.isOpen = true;
}



  toggleSubMenu(item: any) {
    item.isOpen = !item.isOpen;
  }
}
