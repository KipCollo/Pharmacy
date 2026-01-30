import { Component } from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isTrending: boolean;
  inStock: boolean;
}

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

  categories = [
    'Skin Care', 'Beauty Care & Cosmetics', 'Vitamins & Supplements',
    'Medicine', 'Body Building', 'General Hygiene Care',
    'Home Healthcare', 'Bundle Offers', 'Veterinary Products'
  ];

  products: Product[] = [
    { id: 1, name: 'Magnesium Glycinate', price: 2500, image: 'assets/prod1.png', isTrending: true, inStock: true },
    { id: 2, name: 'Vitamin C Gummies', price: 1800, image: 'assets/prod2.png', isTrending: false, inStock: true },
    { id: 3, name: 'Smart Kids Multivitamin', price: 3200, image: 'assets/prod3.png', isTrending: false, inStock: true },
    { id: 4, name: 'Liquid Magnesium', price: 2700, image: 'assets/prod4.png', isTrending: false, inStock: true },
  ];

  minPrice = 0;
  maxPrice = 1000;
  showInStockOnly = false;
  activeSort = 'Most Popular';

}
