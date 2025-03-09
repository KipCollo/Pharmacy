import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent {
  orders: any =[1,2,3];

  constructor(private http: HttpClient) { }

  updateStatus(id: number, status: string) {
    //this.http.put(`/api/orders/${id}/${status}`, {}).subscribe(() => this.loadOrders());
  }

}
