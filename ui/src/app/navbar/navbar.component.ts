import {Component, HostListener, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {TokenService} from "../services/token/token.service";
import {UserComponent} from "../user/user.component";
import {CartComponent} from "../cart/cart.component";
import {CartControllerService} from "../services/services/cart-controller.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    UserComponent,
    CartComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  showDashboard = false; // Controls the user dashboard popup
  cartItemCount: number = 0;

  userFullName: string = 'User';
  userEmail: string = 'user@example.com';
  userProfileImage: string = '/public/login.jpg';
  isLoggedIn = false;
  cart: any[] = []; // Example cart array

  ngOnInit() {
    this.checkLoginStatus();
    this.loadCartCount();

  }

  constructor(private router: Router,
              private  tokenService:TokenService,
              private cartService: CartControllerService) {
    this.checkLoginStatus();
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
  }

  closeCart() {
    this.isCartOpen = false;
  }

  loadCartCount(){
    this.cartService.getUserCart({userId: this.getUserId()}).subscribe(
      (items)=>{this.cartItemCount = items.length;
      })
  }

  isAccountOpen = false;

  toggleAccountDropdown() {
    this.isAccountOpen = !this.isAccountOpen;
  }

// Optional: Close on outside click
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-dropdown')) {
      this.isAccountOpen = false;
    }
  }

  // Redirect to the profile page
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
}
