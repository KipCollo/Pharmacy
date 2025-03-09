import { Component } from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  isLoggedIn = true; // Change this based on authentication status
  cartItems = [
    {id:1 ,name: 'Product 1', price: 19.99 },
    {id:2, name: 'Product 2', price: 29.99 }
  ];

  // constructor() {
  //   // Simulating authentication check
  //   this.isLoggedIn = !!localStorage.getItem('userToken');
  // }
  //
  // cartItems = this.cartService.getCartItems();
  //
  // constructor(private cartService: CartService) {}
  //
  removeFromCart(productId: number) {
   // this.cartService.removeFromCart(productId);
  }

  placeOrder() {
    alert('Order placed successfully!');
  }

}
