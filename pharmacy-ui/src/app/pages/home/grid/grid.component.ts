import { Component } from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  products = [
    {
      name: 'Sudo cream 250mg',
      price: 2484,
      oldPrice: 2760,
      discount: 10,
      image: 'https://via.placeholder.com/200',
      tag: 'Trending',
    },
    {
      name: "Earth's multivitamin tablets 100's",
      price: 2740.5,
      oldPrice: 3045,
      discount: 10,
      image: 'https://via.placeholder.com/200',
    },
    {
      name: 'Hydrolyzed collagen 5500mg',
      price: 3740,
      oldPrice: 4400,
      discount: 15,
      image: 'https://via.placeholder.com/200',
    },
    {
      name: 'Cetaphil oily skin cleanser 236ml',
      price: 2095.25,
      oldPrice: 2465,
      discount: 15,
      image: 'https://via.placeholder.com/200',
    },
  ];

  scroll(container: HTMLElement, direction: number) {
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }

}
