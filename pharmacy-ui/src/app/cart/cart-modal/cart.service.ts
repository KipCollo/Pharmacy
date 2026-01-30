import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  isOpen = signal(false);
  cartItems = signal<any[]>([]);

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }

  addToCart(product: any) {
    this.cartItems.update(items => [...items, { ...product, qty: 1 }]);
    this.openCart();
  }

  subtotal() {
    return this.cartItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  discount() {
    return Math.round(this.subtotal() * 0.1);
  }

  total() {
    return this.subtotal() - this.discount();
  }
}
