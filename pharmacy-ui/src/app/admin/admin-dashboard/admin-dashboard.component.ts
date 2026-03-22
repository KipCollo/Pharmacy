import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CustomersApIsService } from '../../services/services/customers-ap-is.service';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { OrderApIsService } from '../../services/services/order-ap-is.service';
import { PrescriptionControllerService } from '../../services/services/prescription-controller.service';
import { ShipmentTrackingApIsService } from '../../services/services/shipment-tracking-ap-is.service';
import { OrderResponse } from '../../services/models/order-response';
import { PrescriptionResponse } from '../../services/models/prescription-response';
import { ProductResponse } from '../../services/models/product-response';
import { ShipmentResponse } from '../../services/models/shipment-response';
import { UserResponse } from '../../services/models/user-response';

type StatCard = {
  label: string;
  value: number;
  trend: number;
  bars: number[];
};

type TaskItem = {
  title: string;
  assignee: string;
  status: string;
  statusClass: 'status-overdue' | 'status-todo' | 'status-doing';
  dueDate: string;
};

type ComplianceItem = {
  name: string;
  progress: number;
};

type PrescriptionItem = {
  patient: string;
  medicine: string;
};

type DeliveryEvent = {
  day: string;
  time: string;
  orderId: string;
  rider: string;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    NgClass,
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private readonly orderService = inject(OrderApIsService);
  private readonly prescriptionService = inject(PrescriptionControllerService);
  private readonly medicineService = inject(MedicineApIsService);
  private readonly shipmentService = inject(ShipmentTrackingApIsService);
  private readonly customerService = inject(CustomersApIsService);

  welcomeName = 'Pharmacy Team';
  loading = signal(true);
  loadError = signal('');
  lastUpdated = signal<Date | null>(null);

  statsCards = signal<StatCard[]>([]);
  upcomingTasks = signal<TaskItem[]>([]);
  complianceItems = signal<ComplianceItem[]>([]);
  recentPrescriptions = signal<PrescriptionItem[]>([]);
  deliveryEvents = signal<DeliveryEvent[]>([]);

  totalCustomers = signal(0);
  totalRevenue = signal(0);

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.loading.set(true);
    this.loadError.set('');

    forkJoin({
      orders: this.orderService.findAll().pipe(catchError(() => of([] as OrderResponse[]))),
      prescriptions: this.prescriptionService.getAllPrescriptions().pipe(catchError(() => of([] as PrescriptionResponse[]))),
      medicines: this.medicineService.getAllMedicines({ page: 0, size: 500 }).pipe(
        map((res) => res.content ?? []),
        catchError(() => of([] as ProductResponse[]))
      ),
      shipments: this.shipmentService.getShipments().pipe(catchError(() => of([] as ShipmentResponse[]))),
      customers: this.customerService.getAllCustomers().pipe(catchError(() => of([] as UserResponse[])))
    }).subscribe({
      next: ({ orders, prescriptions, medicines, shipments, customers }) => {
        this.applyDashboardData(orders, prescriptions, medicines, shipments, customers);
        this.loading.set(false);
        this.lastUpdated.set(new Date());
      },
      error: () => {
        this.loadError.set('Unable to load dashboard metrics right now.');
        this.loading.set(false);
      }
    });
  }

  exportSummary(): void {
    const summary = [
      `Generated At,${new Date().toISOString()}`,
      `Total Customers,${this.totalCustomers()}`,
      `Total Revenue,${this.totalRevenue()}`,
      `Orders Today,${this.findStat('Total Orders Today')}`,
      `Pending Prescriptions,${this.findStat('Pending Prescriptions')}`,
      `Low Stock Items,${this.findStat('Low Stock Items')}`,
      `Active Deliveries,${this.findStat('Active Deliveries')}`
    ].join('\n');

    const blob = new Blob([summary], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'admin_dashboard_summary.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private applyDashboardData(
    orders: OrderResponse[],
    prescriptions: PrescriptionResponse[],
    medicines: ProductResponse[],
    shipments: ShipmentResponse[],
    customers: UserResponse[]
  ): void {
    const now = Date.now();
    const oneDayMs = 1000 * 60 * 60 * 24;
    const twoDayMs = oneDayMs * 2;

    const ordersToday = orders.filter((order) => this.isWithin(order.createdAt ?? order.localDateTime, now, oneDayMs));
    const ordersYesterdayWindow = orders.filter((order) => this.isWithin(order.createdAt ?? order.localDateTime, now - oneDayMs, oneDayMs));

    const pendingPrescriptions = prescriptions.filter((item) => item.status === 'PENDING');
    const recentPendingPrescriptions = prescriptions.filter((item) => item.status === 'PENDING' && this.isWithin(item.uploadedAt, now, twoDayMs));

    const lowStockItems = medicines.filter((item) => (item.stockQuantity ?? 0) <= 10);
    const activeDeliveries = shipments.filter((item) => item.status === 'IN_PROGRESS' || item.status === 'DRAFT' || item.status === 'DELAYED');

    this.totalCustomers.set(customers.length);
    this.totalRevenue.set(orders.reduce((sum, item) => sum + (item.totalAmount ?? 0), 0));

    this.statsCards.set([
      {
        label: 'Total Orders Today',
        value: ordersToday.length,
        trend: this.computeTrend(ordersToday.length, ordersYesterdayWindow.length),
        bars: this.makeBars([ordersToday.length, ordersYesterdayWindow.length, orders.length])
      },
      {
        label: 'Pending Prescriptions',
        value: pendingPrescriptions.length,
        trend: this.computeTrend(recentPendingPrescriptions.length, pendingPrescriptions.length - recentPendingPrescriptions.length),
        bars: this.makeBars([pendingPrescriptions.length, recentPendingPrescriptions.length])
      },
      {
        label: 'Low Stock Items',
        value: lowStockItems.length,
        trend: lowStockItems.length > 0 ? -Math.min(99, lowStockItems.length * 2) : 0,
        bars: this.makeBars(lowStockItems.slice(0, 7).map((item) => item.stockQuantity ?? 0), true)
      },
      {
        label: 'Active Deliveries',
        value: activeDeliveries.length,
        trend: this.computeTrend(activeDeliveries.length, shipments.length - activeDeliveries.length),
        bars: this.makeBars(activeDeliveries.slice(0, 7).map((item) => item.progressStep ?? 0))
      }
    ]);

    this.complianceItems.set(
      lowStockItems
        .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0))
        .slice(0, 5)
        .map((item) => ({
          name: item.name ?? 'Unknown medicine',
          progress: Math.max(5, Math.min(100, (item.stockQuantity ?? 0) * 10))
        }))
    );

    this.recentPrescriptions.set(
      prescriptions
        .sort((a, b) => this.toMillis(b.uploadedAt) - this.toMillis(a.uploadedAt))
        .slice(0, 5)
        .map((item) => ({
          patient: this.formatName(item.user?.firstName, item.user?.lastName),
          medicine: item.prescriptionItem?.map((entry) => entry.product?.name).filter(Boolean).slice(0, 2).join(' + ') || 'Pending assignment'
        }))
    );

    this.deliveryEvents.set(
      shipments
        .filter((item) => item.status === 'IN_PROGRESS' || item.status === 'DRAFT' || item.status === 'DELAYED')
        .sort((a, b) => this.toMillis(a.expectedArrival) - this.toMillis(b.expectedArrival))
        .slice(0, 5)
        .map((item) => {
          const eta = this.toDate(item.expectedArrival);
          return {
            day: String(eta.getDate()),
            time: `${eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ETA`,
            orderId: item.orderRef ?? 'N/A',
            rider: item.carrier ?? 'Carrier unassigned'
          };
        })
    );

    this.upcomingTasks.set([
      {
        title: `Review ${pendingPrescriptions.length} pending prescriptions`,
        assignee: 'Clinical Team',
        status: pendingPrescriptions.length > 0 ? 'Overdue' : 'Todo',
        statusClass: pendingPrescriptions.length > 0 ? 'status-overdue' : 'status-todo',
        dueDate: 'Today'
      },
      {
        title: `Restock ${lowStockItems.length} low-stock products`,
        assignee: 'Inventory Team',
        status: lowStockItems.length > 0 ? 'Doing' : 'Todo',
        statusClass: lowStockItems.length > 0 ? 'status-doing' : 'status-todo',
        dueDate: 'Today'
      },
      {
        title: `Monitor ${activeDeliveries.length} active deliveries`,
        assignee: 'Logistics',
        status: activeDeliveries.length > 0 ? 'Doing' : 'Todo',
        statusClass: activeDeliveries.length > 0 ? 'status-doing' : 'status-todo',
        dueDate: 'Today'
      }
    ]);
  }

  private findStat(label: string): number {
    return this.statsCards().find((card) => card.label === label)?.value ?? 0;
  }

  private computeTrend(current: number, previous: number): number {
    if (previous <= 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  private makeBars(values: number[], invert = false): number[] {
    const safe = values.length ? values : [0];
    const max = Math.max(...safe, 1);

    return [...Array(7)].map((_, idx) => {
      const source = safe[idx % safe.length];
      const normalized = Math.round((source / max) * 100);
      return invert ? 100 - normalized : Math.max(8, normalized);
    });
  }

  private isWithin(value: string | undefined, anchorMs: number, windowMs: number): boolean {
    const time = this.toMillis(value);
    if (!time) {
      return false;
    }
    return anchorMs - time <= windowMs && anchorMs - time >= 0;
  }

  private toMillis(value: string | undefined): number {
    if (!value) {
      return 0;
    }
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private toDate(value: string | undefined): Date {
    const parsed = new Date(value ?? '');
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  private formatName(firstName?: string, lastName?: string): string {
    const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
    return fullName || 'Unknown patient';
  }
}
