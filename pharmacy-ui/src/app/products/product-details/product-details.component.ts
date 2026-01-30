import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ProductResponse } from '../../services/models/product-response';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-medicine-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  medicine: ProductResponse = {};
  medicineId: number = 0;
  // paramObj: Observable<any>;
  today: Date = new Date();

  constructor(
    private activeRoute: ActivatedRoute,
    private medicineService: MedicineApIsService
  ) { }


  ngOnInit(): void {
    this.getMedicine();
  }

  getMedicine(){
    //this.medicineId = +this.activeRoute.snapshot.paramMap.get("productId")
    this.medicineService.getMedicineById({id: this.medicineId }).subscribe({
      next: (medicine) => {
        this.medicine = medicine;
      }
    })
   // this.activeRoute.paramMap.subscribe(
   //    (data) => {
   //     this.medicineId = +data.get("productId") || 23;
   //     console.log(this.medicineId)
   //       // this.medicineId =23
   //      this.medicineService.getMedicineById({id: this.medicineId }).subscribe({
   //        next: (medicine) => {
   //          this.medicine = medicine;
   //        }
   //      })
   //
   //   }
   //  )
  }

  ngOnDestroy() {
    //this.paramObj.unsubscribe();
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
