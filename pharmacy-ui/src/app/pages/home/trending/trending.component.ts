import { Component, OnInit, inject } from '@angular/core';
import {SlicePipe} from "@angular/common";
import {ProductCardComponent} from "../../../products/product-card/product-card.component";
import {RouterLink} from "@angular/router";
import {ProductResponse} from "../../../services/models/product-response";
import {MedicineApIsService} from "../../../services/services/medicine-ap-is.service";

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [
    ProductCardComponent,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent implements OnInit{
  private trendingService = inject(MedicineApIsService);

  trendingProducts: ProductResponse[] = []
  isLoading = true;
  hasError = false;
  errorMessage = '';

  scroll(container: HTMLElement, direction: number) {
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }

  ngOnInit() {
    this.getSpecialOffers();
  }

  getSpecialOffers(){
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.trendingService.getTrendingProducts().subscribe({
      next: (products) => {
        this.trendingProducts = products;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.hasError = true;
        this.errorMessage = 'Unable to load products';
        this.isLoading = false;
      }
    })
  }


}
