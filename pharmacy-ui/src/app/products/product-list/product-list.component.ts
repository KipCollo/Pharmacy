import {Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { PageResponseProductResponse } from '../../services/models/page-response-product-response';
import { ProductResponse } from '../../services/models/product-response';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { CartControllerService } from '../../services/services/cart-controller.service';
import { TokenService } from '../../services/token/token.service';
import {ProductCardComponent} from "../product-card/product-card.component";
import {ProductCategoryResponse} from "../../services/models/product-category-response";
import {ProductCategoryControllerService} from "../../services/services/product-category-controller.service";
import {LucideAngularModule, Pill} from "lucide-angular/src/icons";
import {icons} from "lucide-angular";
import {CategoryService} from "../../cart/cart-modal/category.service";

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LucideAngularModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private medicineService = inject(MedicineApIsService);
  private router = inject(Router);

  medicineResponse: PageResponseProductResponse = { content: [], totalPages: 0, totalElements: 0 };
  page = 0;
  size = 24;
  totalPages = 0;
  searchQuery = signal<string>('');
  priceMinLimit = 0;
  priceMaxLimit = 10000;
  minPrice = signal(50);
  maxPrice = signal(5000);
  showInStockOnly = signal(false);
  products = signal<ProductResponse[]>([]);
  activeCategory = signal<ProductCategoryResponse | null>(null);
  isLoading = true;
  hasError = false;
  errorMessage = '';
  loadingMore = false;
  popularitySort = signal<'mostPopular' | 'mostRated'>('mostPopular');
  priceSort = signal<'lowToHigh' | 'highToLow' | null>(null); // null = no price sorting
  sortedProducts = computed(() => {
    let sorted = [...this.filteredProducts()];

    // Popularity / Trending sorting
    if (this.popularitySort() === 'mostPopular') {
      sorted.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (this.popularitySort() === 'mostRated') {
      // no rating field → fallback to newArrival as proxy for “mostRated”
      sorted.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }

    // Price sorting (safe with optional price)
    if (this.priceSort() === 'lowToHigh') {
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (this.priceSort() === 'highToLow') {
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return sorted;
  });

  filteredProducts = computed(() => {

    const query = this.searchQuery().toLowerCase();
    const activeCat = this.activeCategory();

    return this.products().filter(medicine => {

      const matchesSearch =
        !query || medicine.name?.toLowerCase().includes(query);

      const price = medicine.price ?? 0;

      const withinPrice =
        price >= this.minPrice() &&
        price <= this.maxPrice();

      const notExpired = !this.isExpired(medicine);

      const stockOk =
        !this.showInStockOnly() ||
        (medicine.stockQuantity ?? 0) > 0;

      const matchesCategory =
        !activeCat || medicine.name === activeCat;

      return (
        matchesSearch &&
        withinPrice &&
        notExpired &&
        stockOk &&
        matchesCategory
      );
    });
  });

  showAllProducts() {
    this.activeCategory.set(null);
  }

  categories = inject(CategoryService);

  goHome() {
    this.router.navigate(['/']);
  }

  goProducts() {
    this.router.navigate(['/products']);
  }

  selectCategory(category: ProductCategoryResponse) {
    this.activeCategory.set(category);

    this.router.navigate(['/products'], {
      queryParams: { category }
    });

    // this.applyFilters();
  }

  ngOnInit(): void {
    this.loadMedicines();
    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  onScroll = (): void => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // When user scrolls within 200px of bottom
    if (scrollTop + windowHeight >= documentHeight - 200) {
      this.loadMore();
    }
  };

  loadMedicines() {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.medicineService.getAllMedicines({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (product) => {
        this.medicineResponse = product;
        this.products.set(product.content || [])
        this.totalPages = product.totalPages ?? 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.hasError = true;
        this.errorMessage = 'Unable to load products';
        this.isLoading = false;
      }
    });
  }

  updateMinPrice(value: number) {
    this.minPrice.set(Math.min(Math.max(value, this.priceMinLimit), this.maxPrice()));
  }

  updateMaxPrice(value: number) {
    this.maxPrice.set(Math.max(Math.min(value, this.priceMaxLimit), this.minPrice()));
  }

  loadMore() {
    if (!this.canLoadMore() || this.loadingMore) return;
    this.loadingMore = true;
    this.page++;

    this.medicineService.getAllMedicines({ page: this.page, size: this.size }).subscribe({
      next: (product) => {
        this.medicineResponse.content = [
          ...(this.medicineResponse.content || []),
          ...(product.content || [])
        ];
        this.totalPages = product.totalPages ?? 0;
      },
      error: (err) => console.error(err),
      complete: () => (this.loadingMore = false)
    });
  }

  canLoadMore(): boolean {
    return this.page + 1 < this.totalPages;
  }


  isExpired(medicine: ProductResponse): boolean {
    if (!medicine.expiryDate) return false;
    return new Date(medicine.expiryDate) < new Date();
  }

  isUnavailable(medicine: ProductResponse): boolean {
    return (medicine.stockQuantity ?? 0) <= 0;
  }

  wishlist = new Set<number>();

  addToWishlist(medicine: ProductResponse) {
    const id = medicine.productId;
    if (!id) return;

    if (this.wishlist.has(id)) {
      this.wishlist.delete(id);
    } else {
      this.wishlist.add(id);
    }
  }

  isWishlisted(medicine: ProductResponse): boolean {
    return !!medicine.productId && this.wishlist.has(medicine.productId);
  }


  protected readonly icons = icons;
  protected readonly Pill = Pill;
}
