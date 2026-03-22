import { Component, OnInit, inject } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShipmentDetailsPanelComponent } from './shipment-details-panel.component';
import { ShipmentResponse } from '../../services/models/shipment-response';
import { ShipmentTrackingApIsService } from '../../services/services/shipment-tracking-ap-is.service';

type ShipmentStatus = 'In Progress' | 'Arrived' | 'Canceled' | 'Draft' | 'Delayed';

interface Shipment {
  id: string;
  progressStep: number;
  status: ShipmentStatus;
  expectedArrival: string;
  orderRef: string;
  carrier: string;
  service: string;
  shippingDate: string;
  origin: string;
  destination: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  totalTime: string;
  departureTime: string;
  timeline: { title: string; time: string; note: string }[];
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    FormsModule,
    ShipmentDetailsPanelComponent
  ],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent implements OnInit {
  private readonly shipmentService = inject(ShipmentTrackingApIsService);

  readonly tabs = ['All Orders', 'Pending', 'Arrived'] as const;
  readonly statuses: ShipmentStatus[] = ['In Progress', 'Arrived', 'Canceled', 'Draft', 'Delayed'];
  readonly progressSteps = [0, 1, 2, 3, 4];

  activeTab: (typeof this.tabs)[number] = 'All Orders';
  searchTerm = '';
  statusMenuOpen = false;
  selectedStatuses = new Set<ShipmentStatus>(['In Progress', 'Arrived', 'Draft']);
  isLoading = false;
  selectedShipment: Shipment | null = null;

  shipments: Shipment[] = [];

  ngOnInit(): void {
    this.loadShipments();
  }

  setTab(tab: (typeof this.tabs)[number]): void {
    this.activeTab = tab;
    this.loadShipments();
  }

  toggleStatusMenu(): void {
    this.statusMenuOpen = !this.statusMenuOpen;
  }

  toggleStatus(status: ShipmentStatus): void {
    if (this.selectedStatuses.has(status)) {
      this.selectedStatuses.delete(status);
    } else {
      this.selectedStatuses.add(status);
    }
    this.loadShipments();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatuses = new Set<ShipmentStatus>(this.statuses);
    this.loadShipments();
  }

  visibleShipments(): Shipment[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.shipments.filter((shipment) => {
      const matchTab = this.activeTab === 'All Orders'
        || (this.activeTab === 'Arrived' && shipment.status === 'Arrived')
        || (this.activeTab === 'Pending' && shipment.status !== 'Arrived');

      const matchStatus = this.selectedStatuses.size === 0
        || this.selectedStatuses.has(shipment.status);

      const matchSearch = term.length === 0
        || shipment.id.toLowerCase().includes(term)
        || shipment.orderRef.toLowerCase().includes(term)
        || shipment.carrier.toLowerCase().includes(term);

      return matchTab && matchStatus && matchSearch;
    });
  }

  statusClass(status: ShipmentStatus): string {
    switch (status) {
      case 'Arrived':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Delayed':
        return 'bg-amber-100 text-amber-700';
      case 'Canceled':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  }

  carrierBadgeClass(carrier: string): string {
    switch (carrier) {
      case 'FedEx':
        return 'bg-indigo-100 text-indigo-700';
      case 'DHL':
        return 'bg-yellow-100 text-yellow-800';
      case 'UPS':
        return 'bg-amber-100 text-amber-800';
      case 'TNT':
        return 'bg-orange-100 text-orange-800';
      case 'Aramex':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }

  isReached(currentStep: number, step: number): boolean {
    return step <= currentStep;
  }

  openShipment(shipment: Shipment): void {
    this.selectedShipment = shipment;
  }

  closeShipment(): void {
    this.selectedShipment = null;
  }

  private navigateShipment(offset: number): void {
    if (!this.selectedShipment) {
      return;
    }

    const currentIndex = this.shipments.findIndex((item) => item.id === this.selectedShipment?.id);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + offset + this.shipments.length) % this.shipments.length;
    this.selectedShipment = this.shipments[nextIndex];
  }

  prevShipment(): void {
    this.navigateShipment(-1);
  }

  nextShipment(): void {
    this.navigateShipment(1);
  }

  private loadShipments(): void {
    this.isLoading = true;
    const statuses = Array.from(this.selectedStatuses).map((status) => this.toApiStatus(status));
    const tab = this.activeTab === 'All Orders' ? 'all' : this.activeTab.toLowerCase();

    this.shipmentService
      .getShipments({
        search: this.searchTerm || undefined,
        statuses,
        tab
      })
      .subscribe({
        next: (data) => {
          this.shipments = data.map((item) => this.toViewModel(item));
          if (this.selectedShipment) {
            this.selectedShipment = this.shipments.find((s) => s.id === this.selectedShipment?.id) ?? null;
          }
          this.isLoading = false;
        },
        error: () => {
          this.shipments = [];
          this.selectedShipment = null;
          this.isLoading = false;
        }
      });
  }

  private toApiStatus(status: ShipmentStatus): 'IN_PROGRESS' | 'ARRIVED' | 'CANCELED' | 'DRAFT' | 'DELAYED' {
    switch (status) {
      case 'In Progress':
        return 'IN_PROGRESS';
      case 'Arrived':
        return 'ARRIVED';
      case 'Canceled':
        return 'CANCELED';
      case 'Draft':
        return 'DRAFT';
      default:
        return 'DELAYED';
    }
  }

  private fromApiStatus(status?: 'IN_PROGRESS' | 'ARRIVED' | 'CANCELED' | 'DRAFT' | 'DELAYED'): ShipmentStatus {
    switch (status) {
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'ARRIVED':
        return 'Arrived';
      case 'CANCELED':
        return 'Canceled';
      case 'DRAFT':
        return 'Draft';
      default:
        return 'Delayed';
    }
  }

  private toViewModel(item: ShipmentResponse): Shipment {
    return {
      id: item.id ?? '',
      progressStep: item.progressStep ?? 0,
      status: this.fromApiStatus(item.status),
      expectedArrival: item.expectedArrival ?? '',
      orderRef: item.orderRef ?? '',
      carrier: item.carrier ?? 'N/A',
      service: item.service ?? 'N/A',
      shippingDate: item.shippingDate ?? '',
      origin: item.origin ?? '',
      destination: item.destination ?? '',
      originLat: item.originLat,
      originLng: item.originLng,
      destinationLat: item.destinationLat,
      destinationLng: item.destinationLng,
      totalTime: item.totalTime ?? '',
      departureTime: item.departureTime ?? '',
      timeline: (item.timeline ?? []).map((entry) => ({
        title: entry.title ?? '',
        time: entry.time ?? '',
        note: entry.note ?? ''
      }))
    };
  }
}
