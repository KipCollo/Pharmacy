import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./shared/footer/footer.component";
import { AnnouncementBarComponent } from './shared/announcement-bar/announcement-bar.component';
import {NgIf} from "@angular/common";
import { NavbarLinksComponent } from "./shared/navbar-links/navbar-links.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    AnnouncementBarComponent,
    FooterComponent,
    NgIf,
    NavbarLinksComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ui';

  constructor(private router: Router) {}

  // Check if current route is admin
  isAdminPage(): boolean {
    const adminPaths = [
      '/admin',
      '/dashboard',
      '/admin-orders',
      '/admin-customers',
      '/reports',
      '/orders-report',
      '/customers-report',
      '/cart-reports'
    ];

    return adminPaths.some(path => this.router.url.startsWith(path));
    //return this.router.url.startsWith('/admin');
  }
}
