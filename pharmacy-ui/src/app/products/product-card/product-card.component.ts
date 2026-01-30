import {Component, Input} from "@angular/core";
import {NgOptimizedImage, SlicePipe} from "@angular/common";
import {ProductResponse} from "../../services/models/product-response";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    SlicePipe,
    NgOptimizedImage
  ],
  templateUrl: './product-card.component.html',
  styleUrl: 'product-card.component.css'
})
export class ProductCardComponent{

  @Input()  medicine: ProductResponse = {}
}
