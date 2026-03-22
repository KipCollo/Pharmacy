import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { OrderApIsService } from "../../services/services/order-ap-is.service";
import { OrderAdminUpdateRequest } from "../../services/models/order-admin-update-request";
import { OrderResponse } from "../../services/models/order-response";
import { ShipmentTrackingApIsService } from "../../services/services/shipment-tracking-ap-is.service";
import { ShipmentResponse } from "../../services/models/shipment-response";

type AdminOrderItem = {
  id: number;
  name: string;
  quantity: number;
  priceText: string;
  image?: string;
};

type AdminOrderView = {
  id: number;
  customer: string;
  customerAddress: string;
  email: string;
  phone: string;
  avatar: string;
  type: string;
  status: 'Paid' | 'Pending' | 'Cancelled' | 'Refunded';
  product: string;
  total: number;
  date?: string;
  items: AdminOrderItem[];
  paymentMethod?: string;
  reference?: string;
  shipmentId?: string;
  shipmentStatus?: string;
  shipmentEta?: string;
  origin?: string;
  destination?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
};

type AdminWorkflowAction = 'APPROVE' | 'PREPARE' | 'DISPATCH' | 'DELIVER' | 'CANCEL';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})

export class AdminOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderApIsService);
  private readonly shipmentService = inject(ShipmentTrackingApIsService);
  private readonly kesFormatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  selectedOrder: AdminOrderView | null = null;
  orders: AdminOrderView[] = [];
  loading = false;
  errorMessage = '';
  workflowMessage = '';
  workflowSubmitting = false;
  selectedOrderIds = new Set<number>();
  shipmentsByOrderRef: Record<string, ShipmentResponse> = {};
  actionMenuOrderId: number | null = null;
  selectedWorkflowAction: AdminWorkflowAction | null = null;
  workflowForm = {
    origin: '',
    carrier: 'Pharmacy Dispatch',
    service: 'Standard',
    expectedArrival: '',
    shippingDate: '',
    departureTime: '',
    totalTime: '2 days',
    originLat: 0,
    originLng: 0,
    destinationLat: 0,
    destinationLng: 0,
    notifyCustomer: true
  };

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      orders: this.orderService.findAll(),
      shipments: this.shipmentService.getShipments().pipe(catchError(() => of([] as ShipmentResponse[])))
    }).subscribe({
      next: ({ orders, shipments }) => {
        this.shipmentsByOrderRef = this.indexShipmentsByOrderRef(shipments);
        this.orders = (orders ?? []).map(order => this.mapToAdminOrder(order));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load orders. Please refresh and try again.';
      }
    });
  }

  private indexShipmentsByOrderRef(shipments: ShipmentResponse[]): Record<string, ShipmentResponse> {
    return shipments.reduce((acc, shipment) => {
      if (!shipment.orderRef) {
        return acc;
      }
      acc[shipment.orderRef] = shipment;
      return acc;
    }, {} as Record<string, ShipmentResponse>);
  }

  private shipmentStatusLabel(status?: ShipmentResponse['status']): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'ARRIVED':
        return 'Arrived';
      case 'CANCELED':
        return 'Canceled';
      case 'DELAYED':
        return 'Delayed';
      case 'DRAFT':
        return 'Draft';
      default:
        return 'No Shipment';
    }
  }

  private mapToAdminOrder(order: OrderResponse): AdminOrderView {
    const firstName = order.customers?.firstName?.trim() ?? '';
    const lastName = order.customers?.lastName?.trim() ?? '';
    const customerName = `${firstName} ${lastName}`.trim() || order.customers?.username || 'Unknown customer';
    const products = order.products ?? [];
    const itemCount = products.length;

    const items: AdminOrderItem[] = products.map((product, index) => ({
      id: product.id ?? index,
      name: product.name ?? 'Unknown product',
      quantity: 1,
      priceText: this.formatKes(product.price ?? 0),
      image: product.image ? `data:image/jpeg;base64,${product.image}` : undefined
    }));

    const avatarName = encodeURIComponent(customerName);
    const shipment = order.reference ? this.shipmentsByOrderRef[order.reference] : undefined;
    const shipmentLabel = this.shipmentStatusLabel(shipment?.status);
    const orderStatus = this.mapOrderStatus(shipment?.status, order.approvalStatus);

    return {
      id: order.orderId ?? 0,
      customer: customerName,
      customerAddress: order.customers?.location ?? 'Customer address pending',
      email: order.customers?.email ?? 'N/A',
      phone: order.customers?.phone ?? 'N/A',
      avatar: `https://ui-avatars.com/api/?name=${avatarName}&background=random`,
      type: order.paymentMethod === 'MPESA' ? 'Mobile Payment' : 'Card/Bank Payment',
      status: orderStatus,
      product: itemCount > 0 ? `${products[0].name}${itemCount > 1 ? ` +${itemCount - 1} more` : ''}` : 'No products',
      total: order.totalAmount ?? 0,
      date: order.createdAt ?? order.localDateTime,
      items,
      paymentMethod: order.paymentMethod,
      reference: order.reference,
      shipmentId: shipment?.id,
      shipmentStatus: shipmentLabel,
      shipmentEta: shipment?.expectedArrival,
      origin: shipment?.origin,
      destination: shipment?.destination,
      originLat: shipment?.originLat,
      originLng: shipment?.originLng,
      destinationLat: shipment?.destinationLat,
      destinationLng: shipment?.destinationLng
    };
  }

  private mapOrderStatus(
    status?: ShipmentResponse['status'],
    approvalStatus?: OrderResponse['approvalStatus']
  ): 'Paid' | 'Pending' | 'Cancelled' | 'Refunded' {
    if (approvalStatus === 'CANCELED') {
      return 'Cancelled';
    }
    if (approvalStatus === 'DELIVERED') {
      return 'Paid';
    }

    switch (status) {
      case 'ARRIVED':
        return 'Paid';
      case 'CANCELED':
        return 'Cancelled';
      case 'IN_PROGRESS':
      case 'DELAYED':
      case 'DRAFT':
      default:
        return 'Pending';
    }
  }

  get formattedTotalRevenue(): string {
    const total = this.orders.reduce((sum, order) => sum + order.total, 0);
    return this.formatKes(total);
  }

  get selectedCount(): number {
    return this.selectedOrderIds.size;
  }

  get paidPercent(): number {
    return this.getStatusPercent('Paid');
  }

  get cancelledPercent(): number {
    return this.getStatusPercent('Cancelled');
  }

  get refundedPercent(): number {
    return this.getStatusPercent('Refunded');
  }

  get pendingPercent(): number {
    return this.getStatusPercent('Pending');
  }

  get avgOrderValue(): string {
    if (!this.orders.length) {
      return this.formatKes(0);
    }
    const avg = this.orders.reduce((sum, order) => sum + order.total, 0) / this.orders.length;
    return this.formatKes(avg);
  }

  private formatKes(amount: number): string {
    return this.kesFormatter.format(amount || 0);
  }

  get topSellingProducts(): Array<{ name: string; count: number }> {
    const counts = new Map<string, number>();

    for (const order of this.orders) {
      for (const item of order.items) {
        const itemName = item.name || 'Unknown product';
        counts.set(itemName, (counts.get(itemName) ?? 0) + (item.quantity || 1));
      }
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getStatusPercent(status: AdminOrderView['status']): number {
    if (!this.orders.length) {
      return 0;
    }
    const statusCount = this.orders.filter(order => order.status === status).length;
    return Math.round((statusCount / this.orders.length) * 100);
  }

  get shipmentCount(): number {
    return Object.keys(this.shipmentsByOrderRef).length;
  }

  get pendingShipmentCount(): number {
    return Object.values(this.shipmentsByOrderRef).filter(
      shipment => shipment.status === 'IN_PROGRESS' || shipment.status === 'DRAFT' || shipment.status === 'DELAYED'
    ).length;
  }

  isAllSelected(): boolean {
    return this.orders.length > 0 && this.selectedOrderIds.size === this.orders.length;
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedOrderIds.clear();
    if (checked) {
      this.orders.forEach(order => this.selectedOrderIds.add(order.id));
    }
  }

  toggleOrderSelection(orderId: number, event: Event): void {
    event.stopPropagation();
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedOrderIds.add(orderId);
      return;
    }
    this.selectedOrderIds.delete(orderId);
  }

  isSelected(orderId: number): boolean {
    return this.selectedOrderIds.has(orderId);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'text-green-600 font-medium';
      case 'Cancelled':
        return 'text-red-600 font-medium';
      case 'Refunded':
        return 'text-orange-600 font-medium';
      default:
        return 'text-gray-600 font-medium';
    }
  }

  getShipmentStatusClass(status?: string): string {
    switch (status) {
      case 'Arrived':
        return 'text-green-600 font-medium';
      case 'In Progress':
        return 'text-blue-600 font-medium';
      case 'Delayed':
        return 'text-orange-600 font-medium';
      case 'Canceled':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-500 font-medium';
    }
  }

  openWorkflowPopup(order: AdminOrderView, action?: AdminWorkflowAction): void {
    this.selectedOrder = order;
    this.selectedWorkflowAction = action ?? null;
    this.actionMenuOrderId = null;
    this.workflowMessage = '';
    this.workflowForm = {
      ...this.workflowForm,
      origin: order.origin ?? 'Main Shop',
      expectedArrival: order.shipmentEta ?? '',
      shippingDate: order.date ?? '',
      departureTime: order.shipmentEta ?? '',
      originLat: order.originLat ?? 0,
      originLng: order.originLng ?? 0,
      destinationLat: order.destinationLat ?? 0,
      destinationLng: order.destinationLng ?? 0
    };
  }

  closeWorkflowPopup(): void {
    this.selectedOrder = null;
    this.selectedWorkflowAction = null;
    this.workflowMessage = '';
  }

  toggleActionMenu(orderId: number, event: Event): void {
    event.stopPropagation();
    this.actionMenuOrderId = this.actionMenuOrderId === orderId ? null : orderId;
  }

  closeActionMenu(): void {
    this.actionMenuOrderId = null;
  }

  onActionSelect(order: AdminOrderView, action: AdminWorkflowAction, event: Event): void {
    event.stopPropagation();
    this.openWorkflowPopup(order, action);
  }

  confirmSelectedWorkflow(): void {
    if (!this.selectedWorkflowAction) {
      return;
    }
    this.runWorkflow(this.selectedWorkflowAction);
  }

  runWorkflow(action: AdminWorkflowAction): void {
    if (!this.selectedOrder) {
      return;
    }

    this.workflowSubmitting = true;
    this.workflowMessage = '';

    const requestBody: OrderAdminUpdateRequest = {
      action,
      origin: this.workflowForm.origin,
      destination: this.selectedOrder.customerAddress,
      carrier: this.workflowForm.carrier,
      service: this.workflowForm.service,
      expectedArrival: this.workflowForm.expectedArrival,
      shippingDate: this.workflowForm.shippingDate,
      departureTime: this.workflowForm.departureTime,
      totalTime: this.workflowForm.totalTime,
      originLat: this.workflowForm.originLat || undefined,
      originLng: this.workflowForm.originLng || undefined,
      destinationLat: this.workflowForm.destinationLat || undefined,
      destinationLng: this.workflowForm.destinationLng || undefined,
      notifyCustomer: this.workflowForm.notifyCustomer
    };

    this.orderService.updateAdminWorkflow({
      orderId: this.selectedOrder.id,
      body: requestBody
    }).subscribe({
      next: (shipment) => {
        this.workflowSubmitting = false;
        this.workflowMessage = `${action} completed. Customer notification ${this.workflowForm.notifyCustomer ? 'sent' : 'skipped'}.`;

        this.selectedOrder = {
          ...this.selectedOrder!,
          shipmentId: shipment.id,
          shipmentStatus: this.shipmentStatusLabel(shipment.status),
          shipmentEta: shipment.expectedArrival,
          origin: shipment.origin,
          destination: shipment.destination,
          originLat: shipment.originLat,
          originLng: shipment.originLng,
          destinationLat: shipment.destinationLat,
          destinationLng: shipment.destinationLng,
          status: this.mapOrderStatus(shipment.status)
        };

        this.loadOrders();
      },
      error: () => {
        this.workflowSubmitting = false;
        this.workflowMessage = `Failed to ${action.toLowerCase()} order. Please try again.`;
      }
    });
  }

}
