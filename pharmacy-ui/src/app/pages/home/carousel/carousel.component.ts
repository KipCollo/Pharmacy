import { AfterViewInit, Component, inject } from '@angular/core';
import Swiper from "swiper";
import { Autoplay, FreeMode } from 'swiper/modules';

import { RouterLink } from "@angular/router";
import { CategoryService } from "../../../cart/cart-modal/category.service";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit {
  productCategory = inject(CategoryService);

  ngAfterViewInit(): void {
    new Swiper('.categories-swiper', {
      modules: [Autoplay, FreeMode],
      slidesPerView: 'auto',
      spaceBetween: 14,
      loop: true,
      speed: 4500,
      freeMode: {
        enabled: true,
        momentum: false
      },
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        reverseDirection: true
      },
      breakpoints: {
        0: {
          spaceBetween: 12
        },
        768: {
          spaceBetween: 14
        },
        1280: {
          spaceBetween: 16
        }
      }
    });
  }

}
