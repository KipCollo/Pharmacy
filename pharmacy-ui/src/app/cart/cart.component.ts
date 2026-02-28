import { Component, EventEmitter, OnInit, Output, signal, inject } from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import { CartControllerService } from "../services/services/cart-controller.service";
import { TokenService } from "../services/token/token.service";
import { jwtDecode } from "jwt-decode";
import { MedicineApIsService } from "../services/services/medicine-ap-is.service";
import { OrderApIsService } from "../services/services/order-ap-is.service";
import {OrderRequest} from "../services/models/order-request";
import {CartResponse} from "../services/models/cart-response";
import {LucideAngularModule} from "lucide-angular/src/icons";
import {icons} from "lucide-angular";
import {CartStore} from "./cart-modal/cart.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})


export class CartComponent{
  private cartService = inject(CartControllerService);
  private orderService = inject(OrderApIsService);
  private tokenService = inject(TokenService);
  private productService = inject(MedicineApIsService);
  cartStore = inject(CartStore);
  private router = inject(Router);


  totalPrice: number = 0;
  @Output() closeCart = new EventEmitter<void>();
  cartItems = signal<CartResponse[]>([]);

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserId() {
    const user = this.decodeToken(this.tokenService.token);
    return user?.userId;
  }

  placeOrder(): void {
    //const userId = this.getUserId();
    if (this.cartItems().length === 0) {
      alert('Cart is empty!');
      return;
    }
    else {
      this.router.navigate(['checkout'])
    }

    const orderRequest: OrderRequest = {
      customers: this.getUserId(),
      paymentMethod: 'MPESA', // You can make this dynamic via a dropdown in the UI
      reference: `REF-${Date.now()}`, // Example unique reference
      products: this.cartItems().flatMap(item =>
        (item.product ?? []).map(p => ({
          productId: p.productId as number,
          quantity: p.quantity ?? 1
        }))
      ),
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
          this.cartItems.set([]);
          this.totalPrice = 0;
          console.log('Cart cleared after placing order');
        },
        error: (err) => console.error('Error clearing cart:', err)
      });
    }

    calculateTotalPrice(): number {
     return  this.totalPrice = this.cartItems().reduce((total, item) => {
        if (!item.product) return total;

        return total + item.product.reduce(
          (sum, p) => sum + (p.price?? 0) * (p.quantity ?? 1),
          0
        );
      }, 0);

    }

  protected readonly icons = icons;
}
