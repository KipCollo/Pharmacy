import { Component, inject } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {PrescriptionControllerService} from "../../services/services/prescription-controller.service";

@Component({
  selector: 'app-prescription-upload',
  standalone: true,
  imports: [],
  templateUrl: './prescription-upload.component.html',
  styleUrl: './prescription-upload.component.css'
})
export class PrescriptionUploadComponent {
  private prescriptionService = inject(PrescriptionControllerService);
  private router = inject(Router);

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPrescription() {
    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile);


    this.prescriptionService.uploadPrescription({body: formData as any}).subscribe({
      next: () => {
        alert('Prescription uploaded successfully')
        this.router.navigate(['prescription-approval'])
      },
      error: (err) => alert('Upload failed: ' + err.message)
    })


  }


}
