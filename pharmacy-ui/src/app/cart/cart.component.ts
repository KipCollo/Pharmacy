import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrencyPipe, NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartControllerService } from "../services/services/cart-controller.service";
import { CartRequest } from "../services/models/cart-request";
import { TokenService } from "../services/token/token.service";
import { jwtDecode } from "jwt-decode";
import { MedicineApIsService } from "../services/services/medicine-ap-is.service";
import { OrderApIsService } from "../services/services/order-ap-is.service";
import {OrderRequest} from "../services/models/order-request";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: CartRequest[] = [];
  recentProducts: any[] = [];
  showCart = true;
  totalPrice: number = 0;
  @Output() closeCart = new EventEmitter<void>();

  toggleCart() {
    this.showCart = !this.showCart;
  }

  constructor(
    private cartService: CartControllerService,
    private orderService: OrderApIsService,
    private tokenService: TokenService,
    private productService: MedicineApIsService
  ) {}

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserId(){
    const user = this.decodeToken(this.tokenService.token);
    return user?.userId;
  }

  ngOnInit() {
    this.loadCart();
  }

  addToCart(medicineId: number): void {
    this.productService.getMedicineById({ id: medicineId }).subscribe(medicine => {
      const cartItem = {
        userId: this.getUserId(),
        productId: medicine.productId,
        name: medicine.name,
        price: medicine.price,
        stockQuantity: medicine.stockQuantity || 1
      };

      this.cartService.addCart({ body: cartItem }).subscribe({
        next: () => {
          console.log('Item added to cart');
          this.loadCart();
        },
        error: (err) => console.error('Error adding to cart:', err)
      });
    });
  }

  loadCart(): void {
    this.cartService.getUserCart({ userId: this.getUserId() }).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotalPrice();
      },
      error: (err) => console.error('Error loading cart', err)
    });
  }

  removeFromCart(cartId: number | undefined): void {
    if (cartId !== undefined) {
      this.cartService.removeFromCart({ cartId }).subscribe({
        next: () => {
          console.log('Item removed from cart');
          this.loadCart();
        },
        error: (err) => console.error('Error removing item:', err)
      });
    } else {
      console.error('Cart ID is undefined');
    }
  }


  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + (item.product?.stockQuantity || 0), 0);
  }

  placeOrder(): void {
    const userId = this.getUserId();
    if (this.cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const orderRequest: OrderRequest = {
      customers: this.getUserId(),
      paymentMethod: 'MPESA', // You can make this dynamic via a dropdown in the UI
      reference: `REF-${Date.now()}`, // Example unique reference
      products: this.cartItems.map(item => ({
        productId: item.product?.id!, // Use non-null assertion
        quantity: item.product?.stockQuantity || 1
      })),
      totalAmount: this.calculateTotalPrice()
    };

    this.orderService.createOrder({ body: orderRequest }).subscribe({
      next: (orderId) => {
        alert(`Order placed successfully! Order ID: ${orderId}`);
        this.clearCartAfterOrder();
      },
      error: (err) => console.error('Error placing order:', err)
    });
  }

  clearCartAfterOrder(): void {
    this.cartService.removeFromCart({ cartId: this.getUserId() }).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        console.log('Cart cleared after placing order');
      },
      error: (err) => console.error('Error clearing cart:', err)
    });
  }

  calculateTotalPrice(): number {
    return this.totalPrice = this.cartItems.reduce(
      (total, item) => total + ((item.product?.price || 0) * (item.product?.stockQuantity || 1)),
      0
    );
  }
}
