import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ProductRequest} from "../services/models/product-request";
import {MedicineApIsService} from "../services/services/medicine-ap-is.service";

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [

    FormsModule,
    NgForOf
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent{

  errorMsg: Array<string> =[]

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

  constructor(private productService: MedicineApIsService, private router: Router) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadProduct(){

    if (!this.selectedFile) {
      alert('Please upload a product image.');
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
        next: () =>{
          this.router.navigate(["activate-account"]);
        },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
        }
      })

    }

    cancel() {
      this.router.navigate(['/admin']);
    }

}
