import {AfterViewInit, Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import Swiper from "swiper";
import {Navigation} from "swiper/modules";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit {
  products: any[] = [1,2,3,4,5,6,7,8,9,10];

  // ngOnInit(): void {
  //   this.productService.getProducts().subscribe(data => {
  //     this.products = data.slice(0, 5); // Fetch only first 5 products
  //   });
  // }

  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      modules: [Navigation],
      loop: true,
      slidesPerView: 7,
      spaceBetween: 20,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
  }
