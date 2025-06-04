import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent {

  orders: any[] = [1,2];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get('/api/orders/user').subscribe((data: any) => {
      this.orders = data;
    });
  }

}
