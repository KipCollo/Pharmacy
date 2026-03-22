import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";

import { FormsModule } from "@angular/forms";
import { ProductRequest } from '../../services/models/product-request';
import { MedicineApIsService } from '../../services/services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent {
  private productService = inject(MedicineApIsService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  message: string = 'Product uploaded successfully!';
  action: string = 'Close';

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,
      {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5000
      }
    );
  }


  errorMsg: Array<string> = []

  product: ProductRequest = {
    description: '',
    expiryDate: '',
    manufacturer: '',
    name: '',
    price: 0,
    stockQuantity: 0,
    type: 'SYRUP'
  };

  selectedFile: File | null = null;

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadProduct() {

    if (!this.selectedFile) {
      this.openSnackBar('Please upload a product image.', this.action);
      return;
    }

    const formData = new FormData();

    // Convert product object to JSON string and append it to FormData
    formData.append('product', new Blob([JSON.stringify(this.product)], { type: 'application/json' }));
    formData.append('image', this.selectedFile); // Append the selected image file

    this.errorMsg = []

    this.productService.createMedicine({
      body: formData as any
    }).subscribe({
      next: () => {
        this.router.navigate(["/admin/medicine"]);
        this.openSnackBar(this.message, this.action);
      },
      error: (err) => {
        this.errorMsg = err?.error?.validationErrors ?? ['Unable to upload product. Please try again.'];
        this.openSnackBar(this.errorMsg[0], this.action);
      }
    })

  }

  cancel() {
    this.router.navigate(['/admin/medicine']);
  }

}
