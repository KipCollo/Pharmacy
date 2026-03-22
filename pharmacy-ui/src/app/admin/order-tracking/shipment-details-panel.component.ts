import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import * as L from 'leaflet';

type ShipmentStatus = 'In Progress' | 'Arrived' | 'Canceled' | 'Draft' | 'Delayed';

interface ShipmentTimelineItem {
    title: string;
    time: string;
    note: string;
}

interface ShipmentDetails {
    id: string;
    progressStep: number;
    status: ShipmentStatus;
    expectedArrival: string;
    orderRef: string;
    carrier: string;
    shippingDate: string;
    origin: string;
    destination: string;
    originLat?: number;
    originLng?: number;
    destinationLat?: number;
    destinationLng?: number;
    totalTime: string;
    departureTime: string;
    timeline: ShipmentTimelineItem[];
}

@Component({
    selector: 'app-shipment-details-panel',
    standalone: true,
    imports: [NgIf, NgForOf, NgClass],
    templateUrl: './shipment-details-panel.component.html',
    styleUrl: './shipment-details-panel.component.css'
})
export class ShipmentDetailsPanelComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input({ required: true }) shipment!: ShipmentDetails;
    @Input() progressSteps: number[] = [0, 1, 2, 3, 4];

    @Output() close = new EventEmitter<void>();
    @Output() previous = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    @ViewChild('leafletMap', { static: false }) leafletMapElement?: ElementRef<HTMLDivElement>;

    private map?: L.Map;
    private originMarker?: L.CircleMarker;
    private destinationMarker?: L.CircleMarker;
    private routeLine?: L.Polyline;

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

    ngAfterViewInit(): void {
        this.initializeMap();
        this.refreshShipmentPath();
        setTimeout(() => this.map?.invalidateSize(), 0);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['shipment'] && this.map) {
            this.refreshShipmentPath();
        }
    }

    ngOnDestroy(): void {
        this.map?.remove();
    }

    private initializeMap(): void {
        if (!this.leafletMapElement || this.map) {
            return;
        }

        this.map = L.map(this.leafletMapElement.nativeElement, {
            zoomControl: true,
            attributionControl: false,
        }).setView([37.2, -113.7], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }).addTo(this.map);
    }

    private refreshShipmentPath(): void {
        if (!this.map) {
            return;
        }

        const { origin, destination } = this.getShipmentCoordinates(this.shipment);

        this.originMarker?.remove();
        this.destinationMarker?.remove();
        this.routeLine?.remove();

        this.originMarker = L.circleMarker(origin, {
            radius: 8,
            fillColor: '#0f172a',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 1,
        })
            .bindPopup(`Origin: ${this.shipment.origin}`)
            .addTo(this.map);

        this.destinationMarker = L.circleMarker(destination, {
            radius: 8,
            fillColor: '#f97316',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 1,
        })
            .bindPopup(`Destination: ${this.shipment.destination}`)
            .addTo(this.map);

        const midpoint: L.LatLngExpression = [
            (origin[0] + destination[0]) / 2 + 1.2,
            (origin[1] + destination[1]) / 2 - 1.1,
        ];

        this.routeLine = L.polyline([origin, midpoint, destination], {
            color: '#f97316',
            weight: 3,
            dashArray: '6 8',
            lineCap: 'round',
        }).addTo(this.map);

        const bounds = L.latLngBounds([origin, destination]);
        this.map.fitBounds(bounds.pad(0.75));
        setTimeout(() => this.map?.invalidateSize(), 0);
    }

    private getShipmentCoordinates(shipment: ShipmentDetails): { origin: [number, number]; destination: [number, number] } {
        if (
            shipment.originLat !== undefined &&
            shipment.originLng !== undefined &&
            shipment.destinationLat !== undefined &&
            shipment.destinationLng !== undefined
        ) {
            return {
                origin: [shipment.originLat, shipment.originLng],
                destination: [shipment.destinationLat, shipment.destinationLng]
            };
        }

        const seedByShipment: Record<string, { origin: [number, number]; destination: [number, number] }> = {
            'SHP-5574': { origin: [40.7128, -74.006], destination: [40.758, -111.876] },
            'SHP-5568': { origin: [37.8044, -122.2712], destination: [36.7378, -119.7871] },
            'SHP-5560': { origin: [32.7767, -96.797], destination: [39.7392, -104.9903] },
            'SHP-5556': { origin: [30.2672, -97.7431], destination: [34.0522, -118.2437] },
            'SHP-5554': { origin: [33.4484, -112.074], destination: [32.7157, -117.1611] },
            'SHP-5551': { origin: [39.5296, -119.8138], destination: [43.615, -116.2023] },
            'SHP-5548': { origin: [27.9506, -82.4572], destination: [25.7617, -80.1918] },
            'SHP-5541': { origin: [41.2565, -95.9345], destination: [45.5152, -122.6784] },
        };

        return seedByShipment[shipment.id] ?? { origin: [-1.286389, 36.817223], destination: [-1.3032, 36.7073] };
    }
}
