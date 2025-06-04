import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ProductResponse } from "../services/models/product-response";
import { MedicineApIsService } from "../services/services/medicine-ap-is.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-medicine-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.css']
})
export class MedicineDetailsComponent implements OnInit {

  medicine: ProductResponse = {};
  today: Date = new Date();
  imageFile: Blob | undefined; // This will hold the uploaded image file
  editMode = false; // Toggle between edit/view mode
  isAdmin = false; // Flag to check if user is admin

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineApIsService
  ) { }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      // Optionally, preview the selected image before uploading
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreview = e.target?.result as string;
        console.log('Image selected:', imagePreview);
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Get the 'edit' query parameter to determine if the user is an admin
    this.isAdmin = this.route.snapshot.queryParamMap.get('edit') === 'true'; // Or replace with an actual role check

    // Set the editMode based on whether the user is an admin
    this.editMode = this.isAdmin;

    if (id) {
      this.medicineService.getMedicineById({ id }).subscribe(
        data => {
          this.medicine = data;
        },
        error => {
          console.error('Error fetching product details:', error);
        }
      );
    } else {
      console.error('No product ID found');
    }
  }

  // Helper Methods
  isExpired(): boolean {
    return this.medicine.expiryDate
      ? new Date(this.medicine.expiryDate) < this.today
      : false;
  }

  isInStock(): boolean {
    return (this.medicine.stockQuantity || 0) > 0;
  }

  // Toggle Edit Mode (optional, if you'd like to allow toggling)
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  // Save Changes
  saveChanges(): void {
    if (!this.medicine.productId) {
      alert("Medicine ID is missing. Cannot update.");
      return;
    }

    const updatedMedicine = {
      medicine: {
        productId: this.medicine.productId,
        name: this.medicine.name,
        description: this.medicine.description,
        expiryDate: this.medicine.expiryDate,
        stockQuantity: this.medicine.stockQuantity,
        manufacturer: this.medicine.manufacturer,
        type: this.medicine.type,
        price: this.medicine.price
      },
      image: this.imageFile // Blob, as required
    };

    this.medicineService.updateMedicine({
      body: updatedMedicine
    }).subscribe({
      next: () => {
        alert("Medicine updated successfully.");
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error updating medicine:', err);
        alert("Failed to update medicine. Please try again.");
      }
    });
  }
}
