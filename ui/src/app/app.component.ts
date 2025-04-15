import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {HeroComponent} from "./hero/hero.component";
import {GridComponent} from "./grid/grid.component";
import {FooterComponent} from "./footer/footer.component";
import {FeatureComponent} from "./feature/feature.component";
import {CarouselComponent} from "./carousel/carousel.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent, HeroComponent, GridComponent, FooterComponent, FeatureComponent, CarouselComponent, NgIf],
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
