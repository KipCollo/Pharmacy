import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ProductResponse } from '../../services/models/product-response';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import {Observable} from "rxjs";
import {icons} from "lucide-angular";
import {LucideAngularModule} from "lucide-angular/src/icons";
import {ProductCategoryResponse} from "../../services/models/product-category-response";

@Component({
  selector: 'app-medicine-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, LucideAngularModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private activeRoute = inject(ActivatedRoute);
  private medicineService = inject(MedicineApIsService);


  medicine: ProductResponse = {};
  medicineId: number = 0;
  //paramObj: Observable<any>;
  today: Date = new Date();
  router = inject(Router)
  activeProduct = signal<ProductResponse | null>(null);


  ngOnInit(): void {
    this.getMedicine();
  }

  getMedicine(){

   this.activeRoute.paramMap.subscribe(
      (data) => {
       this.medicineId = +data.get("productId")!;
        this.medicineService.getMedicineById({id: this.medicineId }).subscribe({
          next: (medicine) => {
            this.activeProduct.set(medicine);
            this.medicine = medicine;
          }
        })
     }
    )
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

  goHome() {
    this.router.navigate(['/']);
  }

  goProducts() {
    this.router.navigate(['/products']);
  }



  protected readonly icons = icons;
}
