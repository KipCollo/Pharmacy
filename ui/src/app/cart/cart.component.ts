import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {CartControllerService} from "../services/services/cart-controller.service";
import {CartRequest} from "../services/models/cart-request";
import {TokenService} from "../services/token/token.service";
import {jwtDecode} from "jwt-decode";
import {MedicineApIsService} from "../services/services/medicine-ap-is.service";

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
export class CartComponent implements OnInit{

  @Input() cartItems: CartRequest[] = [];
  totalPrice: number = 0;
  @Output() closeCart = new EventEmitter<void>();

  constructor(private cartService: CartControllerService,
              private tokenService:TokenService,
              private  productService: MedicineApIsService) {
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserId()
  {
    const user = this.decodeToken(this.tokenService.token);
    return user.userId
  }

  ngOnInit(){
    this.loadCart();
  }

  addToCart(medicineId: any): void {

    this.productService.getMedicineById(medicineId).subscribe( medicine => {
      const cartItem = {
        userId: this.getUserId(),
        productId: medicine.productId,
        name: medicine.name,
        price: medicine.price,
        stockQuantity: medicine.stockQuantity || 1
      };

      this.cartService.addCart({body: cartItem}).subscribe({
        next: (response) => {
          console.log('Item added to cart:', response);
          this.loadCart();
        },
        error: (err) => console.error('Error adding to cart:', err)
      });
    })

  }

  // Get all cart items
  getCartItems(): any[] {
    return this.cartItems;
  }

  loadCart(): void {
    this.cartService.getUserCart(this.getUserId()).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotalPrice();
      },
      error: (err) => console.error('Error loading cart', err)
    });
  }

  // Remove item from the cart
  removeFromCart(cartId: number): void {
    this.cartService.removeFromCart({cartId}).subscribe({
      next: () => {
        console.log('Item removed from cart');
        this.loadCart();
      },
      error: (err) => console.error('Error removing item:', err)
    });
  }

  // Get total number of items in the cart
  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + (item.stockQuantity || 0), 0);
  }


  placeOrder(): void {
    this.cartService.placeOrder(this.getUserId()).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.loadCart(); // clear current cart view
      },
      error: (err) => console.error('Error placing order:', err)
    });
  }

  calculateTotalPrice(): number {
    return this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (2 * (item.stockQuantity || 1)),
      0
    );
  }

}
