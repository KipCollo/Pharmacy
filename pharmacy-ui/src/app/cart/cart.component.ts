
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { DecimalPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { LucideAngularModule } from "lucide-angular/src/icons";
import { icons } from "lucide-angular";
import { finalize } from "rxjs";
import { CartStore } from "./cart-modal/cart.service";
import { OrderRequest } from "../services/models/order-request";
import { UserRequest } from "../services/models/user-request";
import { UserResponse } from "../services/models/user-response";
import { CustomersApIsService } from "../services/services/customers-ap-is.service";
import { OrderApIsService } from "../services/services/order-ap-is.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})


export class CartComponent implements OnInit {
  cartStore = inject(CartStore);
  private customerService = inject(CustomersApIsService);
  private orderService = inject(OrderApIsService);
  private router = inject(Router);

  checkoutSteps: string[] = ['Cart', 'Address', 'Checkout'];
  currentStepIndex = 0;
  customer: UserResponse | null = null;
  address = '';
  paymentMethod: 'MPESA' | 'BANK' | 'BITCOIN' | 'VISA' = 'MPESA';
  reference = `REF-${Date.now()}`;
  loading = true;
  submitting = false;
  error = '';

  @Output() closeCart = new EventEmitter<void>();

  ngOnInit(): void {
    this.cartStore.loadCart();

    this.customerService.getCurrentCustomer().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.customer = res;
        this.address = res.location?.trim() ?? '';
      },
      error: () => {
        this.error = 'Unable to load your details. Please try again.';
      }
    });
  }

  isAddressValid(): boolean {
    return this.address.trim().length >= 3;
  }

  goToAddress(): void {
    if (!this.cartStore.cart().length) {
      alert('Cart is empty!');
      return;
    }
    this.currentStepIndex = 1;
  }

  goToCheckoutStep(): void {
    if (!this.isAddressValid()) {
      this.error = 'Please provide a valid delivery address.';
      return;
    }
    this.error = '';
    this.currentStepIndex = 2;
  }

  goToStep(index: number): void {
    if (index < 0 || index > 2) {
      return;
    }
    this.currentStepIndex = index;
  }

  placeOrder(): void {
    if (!this.customer?.customerId) {
      this.error = 'Unable to identify your account. Please log in again.';
      return;
    }

    const products = this.cartStore.cart().flatMap(cart =>
      (cart.product ?? [])
        .filter(product => !!product.productId)
        .map(product => ({
          productId: product.productId as number,
          quantity: product.quantity ?? 1
        }))
    );

    if (!products.length) {
      this.error = 'Your cart is empty.';
      this.currentStepIndex = 0;
      return;
    }

    const addressToPersist = this.address.trim();
    const customerUpdate: UserRequest = {
      customerId: this.customer.customerId,
      firstName: this.customer.firstName ?? '',
      lastName: this.customer.lastName ?? '',
      email: this.customer.email ?? '',
      password: this.customer.password ?? '',
      dateOfBirth: this.customer.dateOfBirth,
      phone: this.customer.phone,
      location: addressToPersist
    };

    const orderRequest: OrderRequest = {
      customers: { customerId: this.customer.customerId },
      paymentMethod: this.paymentMethod,
      reference: this.reference.trim() || `REF-${Date.now()}`,
      products,
      totalAmount: this.cartStore.getSubtotal()
    };

    this.submitting = true;
    this.error = '';

    this.customerService.updateCustomer({ body: customerUpdate }).subscribe({
      next: () => {
        this.orderService.createOrder({ body: orderRequest }).pipe(
          finalize(() => {
            this.submitting = false;
          })
        ).subscribe({
          next: (orderId) => {
            this.cartStore.clearCartLocal();
            this.cartStore.loadCart();
            this.router.navigate(['/orders'], {
              state: {
                orderPlaced: true,
                orderId
              }
            });
          },
          error: () => {
            this.error = 'Failed to place order. Please try again.';
          }
        });
      },
      error: () => {
        this.submitting = false;
        this.error = 'Failed to save your address. Please check it and try again.';
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  protected readonly icons = icons;
}
