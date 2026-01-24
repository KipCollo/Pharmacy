import { Component, Input } from "@angular/core";
import { ProductResponse } from "../services/models";
import { CommonModule } from "@angular/common";

@Component({
   selector: 'app-product',
   standalone: true,
   imports: [
      CommonModule
   ],
   templateUrl: './product.component.html',
   styleUrl: './product.component.css'
})
export class ProductComponent{
   @Input()
   medicine: ProductResponse = {}
   wishlist = new Set<number>();

}