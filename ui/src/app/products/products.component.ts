import {Component, effect, inject, Input, OnInit, signal} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {FooterComponent} from "../footer/footer.component";
import {PageResponseProductResponse} from "../services/models/page-response-product-response";
import {MedicineApIsService} from "../services/services/medicine-ap-is.service";
import {NgForOf, SlicePipe} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {CartControllerService} from "../services/services/cart-controller.service";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgForOf,
    SlicePipe
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  medicineResponse: PageResponseProductResponse = {}
  page = 0;
  size = 10;

  @Input() product: any;

  private http = inject(HttpClient);
  products = signal<any[]>([]);
  filteredProducts = signal<any[]>([]);
  searchQuery = signal<string>('');
  currentPage = signal<number>(0);
  pageSize = 16;
  totalPages = signal<number>(0);

  constructor(
    private medicineService: MedicineApIsService,
    private cartService: CartControllerService
  ) {
    this.loadProducts();
    effect(() => {
      this.filterProducts();
    });
  }

  ngOnInit(): void {
    this.medicineService.getAllMedicines({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (product) => {
        this.medicineResponse = product
      }
    })
  }

  filterProducts() {
    if (!this.searchQuery()) {
      this.filteredProducts.set(this.products());
      return;
    }
    const query = this.searchQuery().toLowerCase();
    this.filteredProducts.set(
      this.products().filter((product) =>
        product.title.toLowerCase().includes(query)
      )
    );
  }

  loadProducts() {
    this.http
      .get<any>(
        `http://localhost:8080/api/products?page=${this.currentPage()}&size=${this.pageSize}`
      )
      .subscribe((response) => {
        this.products.set(response.content);
        this.filteredProducts.set(response.content);
        this.totalPages.set(response.totalPages);
      });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }


  addToCart() {
   this.cartService.addCart(this.product)
  }

}
