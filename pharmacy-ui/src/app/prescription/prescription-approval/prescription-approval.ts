import { Component } from '@angular/core'
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

class Prescription {
  status: string | undefined;
  imageUrl: any;
}

@Component({
  selector: 'app-prescription-approval',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './prescription-approval.html',
  styleUrl: './prescription-approval.css'
})
export class PrescriptionApprovalComponent {

  selectedFile: File | null = null;
  prescriptions: Prescription[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.http.get<Prescription[]>('/api/prescriptions').subscribe({
      next: (data) => (this.prescriptions = data),
      error: (err) => console.error('Error loading prescriptions:', err)
    });
  }

}
