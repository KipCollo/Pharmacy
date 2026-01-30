import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
})
export class CartModalComponent {
  cart = inject(CartService);
}
