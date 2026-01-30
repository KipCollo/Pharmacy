import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForOf, NgOptimizedImage } from "@angular/common";
import Swiper from "swiper";
import { Autoplay } from 'swiper/modules';

import { RouterLink } from "@angular/router";
import { PageResponseProductResponse } from '../../../services/models/page-response-product-response';
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
  productCategory: Array<ProductCategoryResponse> =[]

  constructor(
    private medicineCategory: ProductCategoryControllerService
  ) {
  }

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
      slidesPerView: 7,
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
