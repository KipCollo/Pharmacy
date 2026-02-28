import {inject, Injectable} from "@angular/core";
import {MedicineApIsService} from "../../services/services/medicine-ap-is.service";
import {PageResponseProductResponse} from "../../services/models/page-response-product-response";

@Injectable({
  providedIn: "root"
})
export class ProductService{

  page = 0;
  size = 24;
  medicineResponse: PageResponseProductResponse = { content: [], totalPages: 0, totalElements: 0 };

  products = inject(MedicineApIsService);

  getProducts(){
    this.products.getAllMedicines({
      page: this.page,
      size: this.size
    }).subscribe({
      next: () => {

      },
      error: () => {

      }
    })
  }
}
