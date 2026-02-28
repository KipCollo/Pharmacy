import {inject, Injectable, signal} from "@angular/core";
import {ProductCategoryResponse} from "../../services/models/product-category-response";
import {ProductCategoryControllerService} from "../../services/services/product-category-controller.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  productCategory = signal<ProductCategoryResponse[]>([])
  categoryService = inject(ProductCategoryControllerService)

  constructor() {
    this.loadProductCategory()
  }

  loadProductCategory(){
    this.categoryService.getProductCategory().subscribe({
      next: (category) => {
        this.productCategory.set(category);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

}
