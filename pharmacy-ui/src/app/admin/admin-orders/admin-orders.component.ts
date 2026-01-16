import { Component, signal } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf,NgIf} from "@angular/common";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    SidebarComponent
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent {
  // orders: any =[1,2,3];

  // constructor(private http: HttpClient) { }

  // updateStatus(id: number, status: string) {
  //   //this.http.put(`/api/orders/${id}/${status}`, {}).subscribe(() => this.loadOrders());
  // }

  // prescriptions: any=[1,2,3,4,5,6];

  // approvePrescription(id: number) {
  //   this.http.put(`/api/prescriptions/${id}/approve`, {}).subscribe({
  //     //next: () => this.loadPrescriptions(),
  //     error: (err) => alert('Error approving: ' + err.message)
  //   });
  // }

  // rejectPrescription(id: number) {
  //   this.http.put(`/api/prescriptions/${id}/reject`, {}).subscribe({
  //     //next: () => this.loadPrescriptions(),
  //     error: (err) => alert('Error rejecting: ' + err.message)
  //   });
  // }


}
