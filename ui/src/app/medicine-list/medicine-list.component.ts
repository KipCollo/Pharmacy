import { Component, effect, OnInit, signal } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { PageResponseProductResponse, ProductResponse } from '../services/models';
import { MedicineApIsService } from '../services/services/medicine-ap-is.service';
import { CartControllerService } from '../services/services/cart-controller.service';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../services/token/token.service';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, SlicePipe, FormsModule],
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  medicineResponse: PageResponseProductResponse = { content: [], totalPages: 0, totalElements: 0 };
  selectedMedicine: ProductResponse | null = null;
  page = 0;
  size = 15;
  totalPages = 0;
  searchQuery = signal<string>('');
  isAdmin: boolean = false;  // This should be determined based on the user's role
  isLoggedIn: boolean = false;  // This should be determined based on the user's login status


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

  getUserId() {
    const user = this.decodeToken(this.tokenService.token);
    return user?.userId;
  }

  isAdminUser(): boolean {
    const user = this.decodeToken(this.tokenService.token);
    return user?.role === 'ADMIN';
  }

  ngOnInit(): void {
    this.isAdmin = this.isAdminUser();
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
        userId: this.getUserId(),
        productId: medicine.productId
      }
    };
    this.cartService.addCart(cartItem).subscribe(() => {
      alert('Added to cart!');
    });
  }

  viewDetails(medicine: ProductResponse) {
    this.selectedMedicine = medicine;
    // Optionally scroll to detail view
  }

  onUpdate(medicine: ProductResponse) {
    this.selectedMedicine = medicine;
    // You can open a modal or navigate to update form
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
    // This could be a redirect to the login page, or show a modal to login
    this.router.navigate(['/login']);  // Redirect to login page
  }


}
