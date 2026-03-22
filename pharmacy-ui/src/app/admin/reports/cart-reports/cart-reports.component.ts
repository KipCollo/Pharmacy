import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CartResponse } from '../../../services/models/cart-response';
import { CartControllerService } from '../../../services/services/cart-controller.service';

type TopCart = {
  label: string;
  count: number;
  value: number;
};

type CartGroup = {
  name: string;
  value: number;
  color: string;
  tileClass: string;
};

@Component({
  selector: 'app-cart-reports',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cart-reports.component.html',
  styleUrl: './cart-reports.component.css'
})
export class CartReportsComponent implements OnInit {
  private readonly cartService = inject(CartControllerService);

  topCarts: TopCart[] = [
    { label: 'No cart data', count: 0, value: 0 }
  ];

  cartGroups: CartGroup[] = [
    { name: 'Started', value: 0, color: '#5099d8', tileClass: 'tile-large-left' },
    { name: 'Checked Out', value: 0, color: '#e25c71', tileClass: 'tile-large-right' },
    { name: 'Abandoned', value: 0, color: '#4ab9aa', tileClass: 'tile-small-left' },
    { name: 'Removed', value: 0, color: '#e89c58', tileClass: 'tile-small-right' }
  ];

  ngOnInit(): void {
    this.cartService.getAllCarts().subscribe({
      next: (carts) => this.buildReport(carts),
      error: () => {
        this.topCarts = [{ label: 'No cart data', count: 0, value: 0 }];
      }
    });
  }

  get maxValue(): number {
    const max = Math.max(...this.topCarts.map((cart) => cart.value));
    return max > 0 ? max : 1;
  }

  getBarWidth(value: number): number {
    return (value / this.maxValue) * 100;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private buildReport(carts: CartResponse[]): void {
    this.topCarts = carts
      .map((cart) => {
        const products = cart.product ?? [];
        const count = products.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
        const value = products.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0);
        return {
          label: `Cart #${cart.id ?? 0}`,
          count,
          value
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    if (this.topCarts.length === 0) {
      this.topCarts = [{ label: 'No cart data', count: 0, value: 0 }];
    }

    const totals = {
      STARTED: 0,
      CHECKED_OUT: 0,
      ABANDONED: 0,
      REMOVED: 0
    };

    carts.forEach((cart) => {
      const value = (cart.product ?? []).reduce(
        (sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)),
        0
      );
      const status = cart.status ?? 'STARTED';
      totals[status] += value;
    });

    this.cartGroups = [
      { name: 'Started', value: totals.STARTED, color: '#5099d8', tileClass: 'tile-large-left' },
      { name: 'Checked Out', value: totals.CHECKED_OUT, color: '#e25c71', tileClass: 'tile-large-right' },
      { name: 'Abandoned', value: totals.ABANDONED, color: '#4ab9aa', tileClass: 'tile-small-left' },
      { name: 'Removed', value: totals.REMOVED, color: '#e89c58', tileClass: 'tile-small-right' }
    ];
  }
}
