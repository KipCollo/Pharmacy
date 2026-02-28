import { Component, computed, OnInit, signal, inject } from "@angular/core";
import {MedicineApIsService} from "../../../services/services/medicine-ap-is.service";
import {ProductResponse} from "../../../services/models/product-response";
import {ProductCardComponent} from "../../../products/product-card/product-card.component";
import { RouterLink} from "@angular/router";

@Component({
  selector: 'app-special-offers',
  imports: [
    ProductCardComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './special-offers.component.html',
  styleUrl: 'special-offers.component.css'

})
export class SpecialOffersComponent implements OnInit{
  private specialOffersService = inject(MedicineApIsService);

  specialOfferProduct = signal<ProductResponse[]>([]);
  topOffers = computed(() => this.specialOfferProduct().slice(0,8));

  scroll(container: HTMLElement, direction: number) {
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }

  ngOnInit() {
    this.getSpecialOffers();
  }

  getSpecialOffers(){
    this.specialOffersService.getSpecialOffers().subscribe({
      next: (products) => {
        this.specialOfferProduct.set(products);
      },
      error: err => {
        console.error("Failed to fetch special offer")
      }
    })
  }

}
