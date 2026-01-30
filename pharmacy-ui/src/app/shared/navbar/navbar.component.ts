import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {jwtDecode} from "jwt-decode";
// import { User} from "lucide-angular"

import { TokenService } from '../../services/token/token.service';
import { CartControllerService } from '../../services/services/cart-controller.service';
// import {LucideAngularModule } from "lucide-angular";
import {User, Heart, ShoppingCart, Search, MapPin, LucideAngularModule} from 'lucide-angular/src/icons';
import {readonly} from "@angular/forms/signals";
import {ChartNoAxesColumn} from "lucide-angular";



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  readonly icons = {
    User,
    MapPin,
    ChartNoAxesColumn,
    Heart,
    ShoppingCart
  }

  showDashboard = false; // Controls the user dashboard popup
  cartItemCount: number = 0;

  userFullName: string = 'User';
  userEmail: string = 'user@example.com';
  userProfileImage: string = '/public/login.jpg';
  isLoggedIn = false;
  cart: any[] = [];

   constructor(private router: Router,
              private  tokenService:TokenService,
              private cartService: CartControllerService) {
   }

  ngOnInit() {
    this.checkLoginStatus();
   // this.loadCartCount();
  }

   home(){
    this.router.navigate(['/home'])
   }

  checkLoginStatus(){
  const token = this.tokenService.token;
  if (token) {
    this.isLoggedIn = true;
    try {
      const decodedToken: any = jwtDecode(token);
      this.userFullName = decodedToken.fullname || 'User';
      this.userEmail = decodedToken.sub || 'user@example.com';

      // If the token contains a profile picture, use it; otherwise, keep the default
      if (decodedToken.profileImage) {
        this.userProfileImage = decodedToken.profileImage;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
}

  isCartOpen = false;

  openCart() {
    this.isCartOpen = true;
    this.router.navigate(['cart'])
  }

  closeCart() {
    this.isCartOpen = false;
  }

  // loadCartCount(){
  //   this.cartService.getUserCart({userId: this.getUserId()}).subscribe(
  //     (items)=>{this.cartItemCount = items.length;
  //     })
  // }

  isAccountOpen = false;

  toggleAccountDropdown() {
    this.isAccountOpen = !this.isAccountOpen;
  }

  // @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-dropdown')) {
      this.isAccountOpen = false;
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    localStorage.removeItem('token'); // Clear the session
    this.isLoggedIn = false; // Update UI
    this.router.navigate(['/login']); // Redirect to login page
  }

  getUserId(): number {
    try {
      const decoded: any = jwtDecode(this.tokenService.token);
      return decoded.userId;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return 0;
    }
  }

  openWishlist() {
    this.router.navigate(['wishlist']);
  }

  protected readonly User = User;
}
