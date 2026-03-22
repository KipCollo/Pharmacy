import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { OrderResponse } from '../services/models/order-response';
import { ShipmentResponse } from '../services/models/shipment-response';
import { OrderApIsService } from '../services/services/order-ap-is.service';
import { ShipmentTrackingApIsService } from '../services/services/shipment-tracking-ap-is.service';

type ShipmentStatus = 'IN_PROGRESS' | 'ARRIVED' | 'CANCELED' | 'DRAFT' | 'DELAYED' | 'UNKNOWN';

interface TrackingStep {
  label: string;
  done: boolean;
  active: boolean;
}

interface OrderTrackingView {
  orderId: number;
  reference: string;
  createdAt: string;
  customerName: string;
  totalAmount: number;
  shipmentStatus: ShipmentStatus;
  shipmentEta: string | null;
  origin?: string | null;
  destination?: string | null;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  message: string;
  progressLabel: string;
  steps: TrackingStep[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './orders.component.css',
  templateUrl: './orders.component.html'
})

export class OrdersComponent implements OnInit {
  private orderService = inject(OrderApIsService);
  private shipmentService = inject(ShipmentTrackingApIsService);

  loading = true;
  error = '';
  successMessage = '';

  orders: OrderTrackingView[] = [];
  selectedOrder: OrderTrackingView | null = null;

  ngOnInit(): void {
    const navigationState = history.state as { orderPlaced?: boolean; orderId?: number };
    if (navigationState?.orderPlaced) {
      this.successMessage = navigationState.orderId
        ? `Order placed successfully. Order ID: ${navigationState.orderId}`
        : 'Order placed successfully.';
    }

    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      orders: this.orderService.findAll(),
      shipments: this.shipmentService.getShipments()
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ({ orders, shipments }) => {
        const shipmentsByOrderRef = this.indexShipmentsByReference(shipments ?? []);
        this.orders = (orders ?? [])
          .map((order) => this.toTrackingView(order, shipmentsByOrderRef))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        this.selectedOrder = this.orders[0] ?? null;
      },
      error: () => {
        this.error = 'Unable to load your orders right now. Please try again in a moment.';
      }
    });
  }

  selectOrder(order: OrderTrackingView): void {
    this.selectedOrder = order;
  }

  getStatusClass(status: ShipmentStatus): string {
    switch (status) {
      case 'ARRIVED':
        return 'status-delivered';
      case 'IN_PROGRESS':
        return 'status-on-way';
      case 'DELAYED':
        return 'status-delayed';
      case 'CANCELED':
        return 'status-canceled';
      case 'DRAFT':
      case 'UNKNOWN':
      default:
        return 'status-preparing';
    }
  }

  private indexShipmentsByReference(shipments: ShipmentResponse[]): Map<string, ShipmentResponse> {
    const indexed = new Map<string, ShipmentResponse>();

    for (const shipment of shipments) {
      const orderRef = shipment.orderRef?.trim();
      if (orderRef) {
        indexed.set(orderRef, shipment);
      }
    }

    return indexed;
  }

  private toTrackingView(order: OrderResponse, shipmentsByOrderRef: Map<string, ShipmentResponse>): OrderTrackingView {
    const reference = order.reference?.trim() || 'N/A';
    const shipment = shipmentsByOrderRef.get(reference);
    const shipmentStatus = (shipment?.status ?? 'UNKNOWN') as ShipmentStatus;
    const customerName = this.getCustomerName(order);

    return {
      orderId: order.orderId ?? 0,
      reference,
      createdAt: order.createdAt ?? order.localDateTime ?? new Date().toISOString(),
      customerName,
      totalAmount: order.totalAmount ?? 0,
      shipmentStatus,
      shipmentEta: shipment?.expectedArrival ?? null,
      origin: shipment?.origin ?? null,
      destination: shipment?.destination ?? order.customers?.location ?? null,
      originLat: shipment?.originLat,
      originLng: shipment?.originLng,
      destinationLat: shipment?.destinationLat,
      destinationLng: shipment?.destinationLng,
      message: this.getStatusMessage(shipmentStatus),
      progressLabel: this.getProgressLabel(shipmentStatus),
      steps: this.buildSteps(shipmentStatus)
    };
  }

  private getCustomerName(order: OrderResponse): string {
    const firstName = order.customers?.firstName?.trim() || '';
    const lastName = order.customers?.lastName?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || order.customers?.email || 'Customer';
  }

  private getStatusMessage(status: ShipmentStatus): string {
    switch (status) {
      case 'ARRIVED':
        return 'Delivered successfully. Thank you for shopping with us.';
      case 'IN_PROGRESS':
        return 'Your package is on the way.';
      case 'DELAYED':
        return 'Shipment delayed. We are working with the carrier to deliver soon.';
      case 'CANCELED':
        return 'This shipment was canceled. Contact support if this was not expected.';
      case 'DRAFT':
      case 'UNKNOWN':
      default:
        return 'Order placed. Your package is being prepared.';
    }
  }

  private getProgressLabel(status: ShipmentStatus): string {
    switch (status) {
      case 'ARRIVED':
        return 'Delivered';
      case 'IN_PROGRESS':
        return 'On the way';
      case 'DELAYED':
        return 'Delayed';
      case 'CANCELED':
        return 'Canceled';
      case 'DRAFT':
      case 'UNKNOWN':
      default:
        return 'Order placed';
    }
  }

  private buildSteps(status: ShipmentStatus): TrackingStep[] {
    const stage = this.getStage(status);

    return [
      { label: 'Order placed', done: stage > 0, active: stage === 0 },
      { label: 'Package prepared', done: stage > 1, active: stage === 1 },
      { label: 'On the way', done: stage > 2, active: stage === 2 },
      { label: 'Delivered', done: stage > 3, active: stage === 3 }
    ];
  }

  private getStage(status: ShipmentStatus): number {
    switch (status) {
      case 'ARRIVED':
        return 3;
      case 'IN_PROGRESS':
      case 'DELAYED':
        return 2;
      case 'DRAFT':
      case 'UNKNOWN':
        return 1;
      case 'CANCELED':
        return 0;
      default:
        return 0;
    }
  }

}
