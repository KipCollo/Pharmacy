import { Component, signal } from '@angular/core';
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



onProductsClick(item: any) {
  // Navigate to ALL PRODUCTS first
  this.router.navigate(['/admin/medicine']);

  // Then open dropdown
  item.isOpen = true;
}



  toggleSubMenu(item: any) {
    item.isOpen = !item.isOpen;
  }

    collapsed = signal(false);

  toggle() {
    this.collapsed.update(v => !v);
  }

  getIconPath(icon: string): string {
  const icons: Record<string, string> = {
    home: 'M3 12l9-9 9 9',
    reports: 'M9 17v-2m4 2V7m4 10v-4',
    orders: 'M4 4h16v16H4z',
    inventory: 'M20 7l-8-4-8 4v10l8 4 8-4z',
    payments: 'M12 1v22',
    customers: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
    notifications:
      'M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5',
    help: 'M12 18h.01M12 6a4 4 0 00-4 4',
    settings: 'M12 8v4l3 3',
  };

  return icons[icon];
}


}
