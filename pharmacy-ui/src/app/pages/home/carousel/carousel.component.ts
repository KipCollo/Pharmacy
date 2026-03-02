import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import Swiper from "swiper";
import { Autoplay } from 'swiper/modules';

import { RouterLink } from "@angular/router";
import {ProductCategoryResponse} from "../../../services/models/product-category-response";
import {CategoryService} from "../../../cart/cart-modal/category.service";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit{
  productCategory = inject(CategoryService);

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
