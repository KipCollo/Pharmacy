import { Component, OnInit, inject } from '@angular/core';
import { ProductCardComponent } from '../../../products/product-card/product-card.component';
import { MedicineApIsService } from '../../../services/services/medicine-ap-is.service';
import { ProductResponse } from '../../../services/models/product-response';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    ProductCardComponent
  ],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent implements OnInit {
  private medicineService = inject(MedicineApIsService);

  featuredProducts: ProductResponse[] = [];

  ngOnInit(): void {
    this.medicineService.getTrendingProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 8);
      },
      error: (err) => {
        console.error('Failed to fetch featured products', err);
      }
    });
  }

  scroll(container: HTMLElement, direction: number): void {
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }

}
