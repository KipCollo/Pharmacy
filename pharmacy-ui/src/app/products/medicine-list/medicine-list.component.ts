import { Component, effect, OnInit, signal } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { PageResponseProductResponse, ProductResponse } from '../services/models';
import { MedicineApIsService } from '../services/services/medicine-ap-is.service';
import { CartControllerService } from '../services/services/cart-controller.service';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../services/token/token.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductComponent } from "../product/product.component";

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, SlicePipe, FormsModule, ProductComponent],
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  medicineResponse: PageResponseProductResponse = { content: [], totalPages: 0, totalElements: 0 };
  selectedMedicine: ProductResponse | null = null;
  medicineRes: ProductResponse = {}
  page = 0;
  size = 24;
  totalPages = 0;
  searchQuery = signal<string>('');
  isAdmin: boolean = false;  // This should be determined based on the user's role
  isLoggedIn: boolean = false;  // This should be determined based on the user's login status
  cartCount = 0;

  constructor(
    private medicineService: MedicineApIsService,
    private cartService: CartControllerService,
    private tokenService: TokenService,
    private router: Router
  ) {
    effect(() => {
      this.filterProducts();
    });
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserId(): number | undefined {
    const token = this.tokenService.token;
    if (!token) {
      return undefined;
    }
    const user = this.decodeToken(token);
    return user?.userId ? Number(user.userId) : undefined;
  }

  ngOnInit(): void {
    const token = this.tokenService.token;

    if (token) {
      const user = this.decodeToken(token);
      this.isLoggedIn = true;
      this.isAdmin = user?.role === 'ADMIN';
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }

    this.loadMedicines();
  }

  loadMedicines() {
    this.medicineService.getAllMedicines({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (product) => {
        this.medicineResponse = product;
        this.totalPages = product.totalPages ?? 0;
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.filterProducts();
  }

  filterProducts() {
    if (!this.searchQuery()) return this.medicineResponse.content || [];
    const query = this.searchQuery().toLowerCase();
    return (this.medicineResponse.content || []).filter((medicine) =>
      medicine.name?.toLowerCase().includes(query)
    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadMedicines();
    }
  }

  addToCart(medicine: ProductResponse) {
    const userId = this.getUserId();
    if (!userId) {
      alert('User not authenticated!');
      return;
    }

    const cartItem = {
      body: {
        userId,
        productId: medicine.productId
      }
    };

    // Add item to the cart via cartService
    this.cartService.addCart(cartItem).subscribe(
      () => {
        alert('Added to cart!');
        this.updateCartCount(); // Update cart count after adding an item
      },
      error => {
        console.error('Error adding item to cart:', error);
        alert('Something went wrong, please try again.');
      }
    );
  }

  // Dynamically update the cart count
  updateCartCount() {
    const userId = this.getUserId();
    if (userId === undefined) {
      console.error('User ID is not defined');
      return;
    }

    // Proceed with the API call if userId is valid
    this.cartService.getUserCart({ userId }).subscribe(cartItems => {
      this.cartCount = cartItems.length; // Update the count based on the current cart items
    });
  }

  //   addToWishlist(medicine: ProductResponse) {
  //   const userId = this.getUserId();
  //   if (!userId) {
  //     alert('Please log in to add to wishlist');
  //     this.promptLogin();
  //     return;
  //   }

  //   const cartItem = {
  //       body: {
  //         userId,
  //         productId: medicine.productId
  //       }
  //     };

  //   this.cartService.addCart(cartItem).subscribe({
  //     next: () => alert('Added to wishlist!'),
  //     error: (err) => console.error('Failed to add to wishlist:', err)
  //   });
  // }


  viewDetails(medicine: ProductResponse) {
    if (!medicine.productId) return;
    this.router.navigate(['/product', medicine.productId]);
  }

  onUpdate(medicine: ProductResponse) {
    this.selectedMedicine = medicine;
  }

  onDelete(id: number | undefined) {
    if (id !== undefined && confirm('Are you sure you want to delete this product?')) {
      this.medicineService.deleteMedicine({ id }).subscribe(() => {
        alert('Product deleted');
        this.loadMedicines(); // Reload product list
      });
    } else {
      console.error('Invalid product ID');
    }
  }

  checkout() {
    if (!this.isLoggedIn) {
      this.promptLogin();  // Show login prompt or redirect to login page
    } else {
      // Proceed with checkout for logged-in user
    }
  }

  promptLogin() {
    this.router.navigate(['/login']);  // Redirect to login page
  }

  loadingMore = false;

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
      complete: () => this.loadingMore = false
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

  shouldDisplay(medicine: ProductResponse): boolean {
    return !this.isExpired(medicine) && !this.isUnavailable(medicine);
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


}
