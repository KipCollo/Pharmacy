import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

class Prescription {
  status: string | undefined;
  imageUrl: any;
}

@Component({
  selector: 'app-prescription-upload',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './prescription-upload.component.html',
  styleUrl: './prescription-upload.component.css'
})
export class PrescriptionUploadComponent {
  selectedFile: File | null = null;
  prescriptions: Prescription[] = [];

  constructor(private http: HttpClient,
              private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPrescription() {
    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('/api/prescriptions/upload', formData).subscribe({
      next: () => {
        alert('Prescription uploaded successfully');
        this.router.navigate(['prescription-approval'])
      },
      error: (err) => alert('Upload failed: ' + err.message)
    });
  }


}
