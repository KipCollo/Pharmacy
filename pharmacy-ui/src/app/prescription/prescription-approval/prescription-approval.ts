import { Component, OnInit, inject } from '@angular/core'
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {PrescriptionResponse} from "../../services/models/prescription-response";
import {PrescriptionControllerService} from "../../services/services/prescription-controller.service";

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
export class PrescriptionApprovalComponent implements OnInit{
  private prescriptionService = inject(PrescriptionControllerService);


  prescription: PrescriptionResponse = {};
  prescriptions: PrescriptionResponse[] =[]

  ngOnInit() {
    this.loadLatestPrescriptions();
    this.loadPrescriptions();
  }

  loadLatestPrescriptions() {
    this.prescriptionService.getLatestApprovedPrescription().subscribe({
      next: (prescription) => {
        this.prescription = prescription
      }
    })
  }

  loadPrescriptions(){
    this.prescriptionService.getUserPrescriptions().subscribe({
      next: (prescriptions) => {
        this.prescriptions = prescriptions
      }
    })
  }

}
