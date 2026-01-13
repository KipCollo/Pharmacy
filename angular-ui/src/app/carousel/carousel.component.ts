import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForOf, NgOptimizedImage } from "@angular/common";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { MedicineApIsService } from "../services/services/medicine-ap-is.service";
import { Autoplay } from 'swiper/modules';

Swiper.use([Autoplay]);

new Swiper('.categories-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 16,
  loop: true,
  speed: 6000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    reverseDirection: false // moves to the right
  }
});

import { PageResponseProductResponse } from "../services/models/page-response-product-response";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit {
  products: PageResponseProductResponse = {};

  categories = [
    { id: 1, name: 'Pain Relief', image: '../public/login.jpg' },
    { id: 2, name: 'Vitamins', image: 'assets/categories/vitamins.jpg' },
    { id: 3, name: 'Skincare', image: 'assets/categories/skincare.jpg' },
    { id: 4, name: 'Baby Care', image: 'assets/categories/baby.jpg' },
    { id: 5, name: 'Medical', image: 'assets/categories/medical.jpg' }
  ];

  constructor(
    private medicineService: MedicineApIsService
  ) {
  }

  ngAfterViewInit(): void {
    new Swiper('.categories-swiper', {
      modules: [Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 6,
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
