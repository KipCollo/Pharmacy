import { Component, OnInit, inject } from "@angular/core";
import {MedicineApIsService} from "../../../services/services/medicine-ap-is.service";
import {ProductResponse} from "../../../services/models/product-response";
import {NgForOf, SlicePipe} from "@angular/common";
import {ProductCardComponent} from "../../../products/product-card/product-card.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-new-arrival',
  templateUrl: 'new-arrival.component.html',
  standalone: true,
  imports: [
    SlicePipe,
    ProductCardComponent,
    RouterLink
  ],
  styleUrl: 'new-arrival.component.css'
})

export class NewArrivalComponent implements OnInit{
  private newArrivalsService = inject(MedicineApIsService);

  newArrival: ProductResponse[] =[]

  scroll(container: HTMLElement, direction: number) {
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }

  ngOnInit() {
    this.getSpecialOffers();
  }

  getSpecialOffers(){
    this.newArrivalsService.getNewArrivals().subscribe({
      next: (products) => {
        this.newArrival = products;
      },
      error: err => {
        console.error("Failed to fetch New Arrivals")
      }
    })
  }

  trackByProductId(index: number, item: ProductResponse) {
    return item.productId;
  }
}
