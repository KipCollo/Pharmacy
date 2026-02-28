import { Injectable, signal, inject } from '@angular/core';
import {CartResponse} from "../../services/models/cart-response";
import {CartControllerService} from "../../services/services/cart-controller.service";
import {CartRequest} from "../../services/models/cart-request";

@Injectable({ providedIn: 'root' })
export class CartStore{
  private cartService = inject(CartControllerService);

  isOpen = signal(false);
  cart = signal<CartResponse[]>([]);
  cartRequest: CartRequest = { product: [] };

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getUserCart( ).subscribe({
      next: (items) => {
        this.cart.set(items);
      },
      error: (err) => console.error('Error loading cart', err)
    });
  }

  addToCart(medicineId: number){

    if (medicineId === null || medicineId === undefined || medicineId <= 0) {
      console.error('Invalid product ID, cannot add to cart');
      return;
    }

    const productEntry = {
      id: medicineId,
      quantity: 1
    };

    if (!this.cartRequest.product) {
      this.cartRequest.product = [];
    }

    this.cartRequest.product?.push(productEntry);

    this.cartService.addCart({body: this.cartRequest}).subscribe({
      next: () => {

        this.openCart();
        this.loadCart();
      },
      error: (err) => console.error('Error adding to cart:', err)
    });
  }

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }

  removeItemFromCart(cartId: number,productId: number) {
    this.cartService.removeProductFromCart({cartId: cartId, productId: productId}).subscribe({
      next: () => {this.cart.update(carts =>
        carts.map(cart => ({
          ...cart,
          product: (cart.product ?? []).filter(
            p => p.productId !== productId
          )
        }))
      )}
    })

  }


  getSubtotal(): number {
    return this.cart().reduce((acc, item) => {
      if (!item.product) return acc;

      return acc + item.product.reduce(
        (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 1),
        0
      );
    }, 0);
  }

  updateQuantity(id: number | undefined, change: number) {
    const item = this.cart().find(i => i.id === id);
    if (!item?.product || item.product.length === 0) return;

    const product = item.product[0];
    const newQuantity = (product.quantity ?? 0) + change;

    if (newQuantity >= 1) {
      product.quantity = newQuantity;
    }

  }

  getCartCount(): number {
    return this.cart().reduce((count, item) => {
      if (!item.product) return count;

      return count + item.product.reduce(
        (sum, p) => sum + (p.quantity || 0),
        0
      );
    }, 0);
  }

}
