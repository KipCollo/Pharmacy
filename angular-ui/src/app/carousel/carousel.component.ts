import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import Swiper from "swiper";
import {Navigation} from "swiper/modules";
import {MedicineApIsService} from "../services/services/medicine-ap-is.service";

import {PageResponseProductResponse} from "../services/models/page-response-product-response";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit ,OnInit{
  products: PageResponseProductResponse= {};

  constructor(
    private medicineService: MedicineApIsService
  ) {
  }

  ngOnInit(): void {
      this.medicineService.getAllMedicines().subscribe({
        next: (product) => {
          this.products = product//.slice(0, 5); // Fetch only first 5 products
        }
      })
    }

  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      modules: [Navigation],
      loop: true,
      slidesPerView: 9,
      spaceBetween: 2,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
  }
