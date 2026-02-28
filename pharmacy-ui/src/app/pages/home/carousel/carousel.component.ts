import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import Swiper from "swiper";
import { Autoplay } from 'swiper/modules';

import { RouterLink } from "@angular/router";
import {ProductCategoryControllerService} from "../../../services/services/product-category-controller.service";
import {ProductCategoryResponse} from "../../../services/models/product-category-response";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit, OnInit {
  private medicineCategory = inject(ProductCategoryControllerService);

  productCategory: Array<ProductCategoryResponse> =[]

  ngOnInit() {
    this.getProductCategory()
  }

  getProductCategory(){
    this.medicineCategory.getProductCategory().subscribe({
      next: (category) =>{
        this.productCategory = category;
      }
      }
    )
  }

  ngAfterViewInit(): void {
    new Swiper('.categories-swiper', {
      modules: [Autoplay],
      slidesPerView: 9,
      spaceBetween: 10,
      loop: true,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true
      }
    });
  }

}
