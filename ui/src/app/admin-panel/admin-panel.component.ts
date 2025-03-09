import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  prescriptions: any=[1,2,3,4,5,6];

  constructor(private http:HttpClient) {
  }
  approvePrescription(id: number) {
    this.http.put(`/api/prescriptions/${id}/approve`, {}).subscribe({
      //next: () => this.loadPrescriptions(),
      error: (err) => alert('Error approving: ' + err.message)
    });
  }

  rejectPrescription(id: number) {
    this.http.put(`/api/prescriptions/${id}/reject`, {}).subscribe({
      //next: () => this.loadPrescriptions(),
      error: (err) => alert('Error rejecting: ' + err.message)
    });
  }

}
