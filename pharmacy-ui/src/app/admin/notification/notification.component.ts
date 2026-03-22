import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { catchError, map, of, forkJoin } from 'rxjs';
import { PrescriptionResponse } from '../../services/models/prescription-response';
import { ProductResponse } from '../../services/models/product-response';
import { ShipmentResponse } from '../../services/models/shipment-response';
import { UserResponse } from '../../services/models/user-response';
import { OrderResponse } from '../../services/models/order-response';
import { CustomersApIsService } from '../../services/services/customers-ap-is.service';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { OrderApIsService } from '../../services/services/order-ap-is.service';
import { PrescriptionControllerService } from '../../services/services/prescription-controller.service';
import { ShipmentTrackingApIsService } from '../../services/services/shipment-tracking-ap-is.service';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface AdminNotification {
  id: number;
  title: string;
  message: string;
  createdAt: Date;
  type: NotificationType;
  read: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, DatePipe, NgClass],
  templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit {
  private readonly prescriptionsService = inject(PrescriptionControllerService);
  private readonly orderService = inject(OrderApIsService);
  private readonly customersService = inject(CustomersApIsService);
  private readonly medicineService = inject(MedicineApIsService);
  private readonly shipmentService = inject(ShipmentTrackingApIsService);

  private readonly recentWindowMs = 1000 * 60 * 60 * 24;
  private readonly lowStockThreshold = 10;

  notifications = signal<AdminNotification[]>([]);
  loading = signal(true);
  loadError = signal('');
  lastUpdated = signal<Date | null>(null);

  unreadCount = computed(() => this.notifications().filter((item) => !item.read).length);

  ngOnInit(): void {
    this.refreshNotifications();
  }

  refreshNotifications(): void {
    this.loading.set(true);
    this.loadError.set('');

    forkJoin({
      prescriptions: this.prescriptionsService.getAllPrescriptions().pipe(catchError(() => of([] as PrescriptionResponse[]))),
      orders: this.orderService.findAll().pipe(catchError(() => of([] as OrderResponse[]))),
      customers: this.customersService.getAllCustomers().pipe(catchError(() => of([] as UserResponse[]))),
      medicines: this.medicineService.getAllMedicines({ page: 0, size: 500 }).pipe(
        map((res) => res.content ?? []),
        catchError(() => of([] as ProductResponse[]))
      ),
      shipments: this.shipmentService.getShipments().pipe(catchError(() => of([] as ShipmentResponse[])))
    }).subscribe({
      next: ({ prescriptions, orders, customers, medicines, shipments }) => {
        const notificationItems = this.buildNotifications(prescriptions, orders, customers, medicines, shipments)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        this.notifications.set(notificationItems);
        this.lastUpdated.set(new Date());
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set('Unable to load notifications right now.');
      }
    });
  }

  private buildNotifications(
    prescriptions: PrescriptionResponse[],
    orders: OrderResponse[],
    customers: UserResponse[],
    medicines: ProductResponse[],
    shipments: ShipmentResponse[]
  ): AdminNotification[] {
    const now = Date.now();
    let nextId = 1;

    const recentPrescriptions = prescriptions
      .filter((item) => this.isRecent(item.uploadedAt, now))
      .sort((a, b) => this.toMillis(b.uploadedAt) - this.toMillis(a.uploadedAt))
      .slice(0, 5)
      .map((item) => ({
        id: nextId++,
        title: 'Prescription uploaded',
        message: `Prescription #${item.id ?? 'N/A'} uploaded by ${this.formatUserName(item.user?.firstName, item.user?.lastName)}.`,
        createdAt: this.normalizeDate(item.uploadedAt),
        type: 'success' as NotificationType,
        read: false
      }));

    const recentOrders = orders
      .filter((item) => this.isRecent(item.createdAt ?? item.localDateTime, now))
      .sort((a, b) => this.toMillis(b.createdAt ?? b.localDateTime) - this.toMillis(a.createdAt ?? a.localDateTime))
      .slice(0, 5)
      .map((item) => ({
        id: nextId++,
        title: 'Product ordered',
        message: `Order #${item.orderId ?? 'N/A'} (${item.reference ?? 'No ref'}) placed by ${this.formatUserName(item.customers?.firstName, item.customers?.lastName)}.`,
        createdAt: this.normalizeDate(item.createdAt ?? item.localDateTime),
        type: 'success' as NotificationType,
        read: false
      }));

    const recentCustomers = customers
      .filter((item) => this.isRecent(item.createdDate, now))
      .sort((a, b) => this.toMillis(b.createdDate) - this.toMillis(a.createdDate))
      .slice(0, 5)
      .map((item) => ({
        id: nextId++,
        title: 'New customer',
        message: `${this.formatUserName(item.firstName, item.lastName)} account created (${item.email ?? 'no email'}).`,
        createdAt: this.normalizeDate(item.createdDate),
        type: 'info' as NotificationType,
        read: false
      }));

    const lowStockProducts = medicines
      .filter((item) => (item.stockQuantity ?? 0) <= this.lowStockThreshold)
      .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0))
      .slice(0, 5)
      .map((item) => ({
        id: nextId++,
        title: 'Low stock warning',
        message: `${item.name ?? 'Product'} stock is ${item.stockQuantity ?? 0} (threshold ${this.lowStockThreshold}).`,
        createdAt: new Date(),
        type: 'warning' as NotificationType,
        read: false
      }));

    const failures = shipments
      .filter((item) => item.status === 'CANCELED' || item.status === 'DELAYED')
      .sort((a, b) => this.toMillis(b.departureTime ?? b.shippingDate) - this.toMillis(a.departureTime ?? a.shippingDate))
      .slice(0, 5)
      .map((item) => ({
        id: nextId++,
        title: 'Failures',
        message: `Shipment ${item.id ?? 'N/A'} for order ${item.orderRef ?? 'N/A'} is ${item.status?.toLowerCase()}.`,
        createdAt: this.normalizeDate(item.departureTime ?? item.shippingDate),
        type: 'error' as NotificationType,
        read: false
      }));

    const fallbackMessages: AdminNotification[] = [];

    if (!recentPrescriptions.length) {
      fallbackMessages.push({
        id: nextId++,
        title: 'Prescription uploaded',
        message: 'No new prescription uploads in the last 24 hours.',
        createdAt: new Date(),
        type: 'info',
        read: true
      });
    }

    if (!recentOrders.length) {
      fallbackMessages.push({
        id: nextId++,
        title: 'Product ordered',
        message: 'No new product orders in the last 24 hours.',
        createdAt: new Date(),
        type: 'info',
        read: true
      });
    }

    if (!recentCustomers.length) {
      fallbackMessages.push({
        id: nextId++,
        title: 'New customer',
        message: 'No new customers in the last 24 hours.',
        createdAt: new Date(),
        type: 'info',
        read: true
      });
    }

    if (!lowStockProducts.length) {
      fallbackMessages.push({
        id: nextId++,
        title: 'Low stock warning',
        message: 'No products are below the low-stock threshold.',
        createdAt: new Date(),
        type: 'info',
        read: true
      });
    }

    if (!failures.length) {
      fallbackMessages.push({
        id: nextId++,
        title: 'Failures',
        message: 'No delayed or canceled shipments found.',
        createdAt: new Date(),
        type: 'info',
        read: true
      });
    }

    return [
      ...recentPrescriptions,
      ...recentOrders,
      ...recentCustomers,
      ...lowStockProducts,
      ...failures,
      ...fallbackMessages
    ];
  }

  private isRecent(dateValue: string | undefined, nowMs: number): boolean {
    if (!dateValue) {
      return false;
    }
    const parsed = new Date(dateValue).getTime();
    if (Number.isNaN(parsed)) {
      return false;
    }
    return nowMs - parsed <= this.recentWindowMs;
  }

  private getLatestDate(values: Array<string | undefined>, fallback: Date): Date {
    const validValues = values
      .filter((item): item is string => !!item)
      .map((item) => new Date(item).getTime())
      .filter((item) => !Number.isNaN(item));

    if (!validValues.length) {
      return fallback;
    }

    return new Date(Math.max(...validValues));
  }

  private toMillis(value: string | undefined): number {
    if (!value) {
      return 0;
    }
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private normalizeDate(value: string | undefined): Date {
    if (!value) {
      return new Date();
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  private formatUserName(firstName?: string, lastName?: string): string {
    const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
    return fullName || 'Unknown user';
  }

  markAsRead(id: number) {
    this.notifications.update((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }

  markAllAsRead() {
    this.notifications.update((items) => items.map((item) => ({ ...item, read: true })));
  }

  clearRead() {
    this.notifications.update((items) => items.filter((item) => !item.read));
  }

  badgeClass(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'error':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-sky-100 text-sky-700';
    }
  }
}
