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

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineApIsService
  ) { }


  ngOnInit(): void {
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

}
