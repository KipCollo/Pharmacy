import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderResponse } from '../../services/models/order-response';
import { ShipmentResponse } from '../../services/models/shipment-response';
import { OrderApIsService } from '../../services/services/order-ap-is.service';
import { ShipmentTrackingApIsService } from '../../services/services/shipment-tracking-ap-is.service';

type PaymentMethod = 'MPESA' | 'BANK' | 'BITCOIN' | 'VISA';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

interface PaymentRecord {
  id: number;
  orderRef: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  private readonly orderService = inject(OrderApIsService);
  private readonly shipmentService = inject(ShipmentTrackingApIsService);

  payments = signal<PaymentRecord[]>([]);
  statusFilter = signal<'ALL' | PaymentStatus>('ALL');
  methodFilter = signal<'ALL' | PaymentMethod>('ALL');
  loading = signal(true);
  loadError = signal('');
  lastUpdated = signal<Date | null>(null);
  private statusOverrides = signal<Record<number, PaymentStatus>>({});

  ngOnInit(): void {
    this.refreshPayments();
  }

  refreshPayments(): void {
    this.loading.set(true);
    this.loadError.set('');

    forkJoin({
      orders: this.orderService.findAll(),
      shipments: this.shipmentService.getShipments().pipe(catchError(() => of([] as ShipmentResponse[])))
    }).subscribe({
      next: ({ orders, shipments }) => {
        const shipmentsByOrderRef = this.indexShipmentsByRef(shipments ?? []);
        const rows = (orders ?? [])
          .map((order) => this.mapOrderToPayment(order, shipmentsByOrderRef))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        this.payments.set(rows);
        this.statusOverrides.set({});
        this.lastUpdated.set(new Date());
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Unable to load payments right now.');
        this.loading.set(false);
      }
    });
  }

  filteredPayments = computed(() =>
    this.payments().filter((item) => {
      const currentStatus = this.getEffectiveStatus(item);
      const byStatus = this.statusFilter() === 'ALL' || item.status === this.statusFilter();
      const byMethod = this.methodFilter() === 'ALL' || item.method === this.methodFilter();
      return (this.statusFilter() === 'ALL' || currentStatus === this.statusFilter()) && byMethod;
    })
  );

  totalValue = computed(() => this.payments().reduce((sum, item) => sum + item.amount, 0));
  pendingCount = computed(() => this.payments().filter((item) => this.getEffectiveStatus(item) === 'PENDING').length);
  failedCount = computed(() => this.payments().filter((item) => this.getEffectiveStatus(item) === 'FAILED').length);
  paidValue = computed(() =>
    this.payments()
      .filter((item) => this.getEffectiveStatus(item) === 'PAID')
      .reduce((sum, item) => sum + item.amount, 0)
  );

  updateStatusFilter(value: string) {
    this.statusFilter.set(value as 'ALL' | PaymentStatus);
  }

  updateMethodFilter(value: string) {
    this.methodFilter.set(value as 'ALL' | PaymentMethod);
  }

  markAsPaid(id: number) {
    this.statusOverrides.update((current) => ({ ...current, [id]: 'PAID' }));
  }

  markAsFailed(id: number) {
    this.statusOverrides.update((current) => ({ ...current, [id]: 'FAILED' }));
  }

  getEffectiveStatus(payment: PaymentRecord): PaymentStatus {
    return this.statusOverrides()[payment.id] ?? payment.status;
  }

  private indexShipmentsByRef(shipments: ShipmentResponse[]): Record<string, ShipmentResponse> {
    return shipments.reduce((acc, shipment) => {
      const ref = shipment.orderRef?.trim();
      if (ref) {
        acc[ref] = shipment;
      }
      return acc;
    }, {} as Record<string, ShipmentResponse>);
  }

  private mapOrderToPayment(order: OrderResponse, shipmentsByOrderRef: Record<string, ShipmentResponse>): PaymentRecord {
    const reference = order.reference?.trim() || `ORD-${order.orderId ?? 0}`;
    const customerName = `${order.customers?.firstName ?? ''} ${order.customers?.lastName ?? ''}`.trim() || order.customers?.email || 'Unknown customer';
    const paymentMethod = (order.paymentMethod ?? 'MPESA') as PaymentMethod;
    const shipment = shipmentsByOrderRef[reference];

    return {
      id: order.orderId ?? 0,
      orderRef: reference,
      customerName,
      amount: order.totalAmount ?? 0,
      method: paymentMethod,
      status: this.statusFromShipment(shipment?.status),
      createdAt: this.toDate(order.createdAt ?? order.localDateTime)
    };
  }

  private statusFromShipment(status?: ShipmentResponse['status']): PaymentStatus {
    switch (status) {
      case 'ARRIVED':
        return 'PAID';
      case 'CANCELED':
        return 'FAILED';
      case 'DELAYED':
      case 'IN_PROGRESS':
      case 'DRAFT':
      default:
        return 'PENDING';
    }
  }

  private toDate(value?: string): Date {
    if (!value) {
      return new Date();
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  statusClass(status: PaymentStatus): string {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'FAILED':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  }
}
