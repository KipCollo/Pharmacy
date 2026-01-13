import { Component, signal } from '@angular/core';
import { ProductResponse } from '../../services/models/product-response';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineComponent } from "../medicine/medicine.component";

@Component({
  selector: 'app-admin-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule, MedicineComponent],
  templateUrl: './admin-medicine.component.html',
  styleUrl: './admin-medicine.component.css'
})
export class AdminMedicineComponent {
  products: ProductResponse[] = [];
  searchQuery = signal('');
  actionsOpen: { [id: number]: boolean } = {};

  constructor(
    private medicineService: MedicineApIsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.medicineService.getAllMedicines({ page: 0, size: 1000 }).subscribe({
      next: (res) => {
        this.products = res.content || [];
      },
      error: (err) => console.error(err)
    });
  }

  filteredProducts() {
    const query = this.searchQuery();
    return query
      ? this.products.filter(p => p.name?.toLowerCase().includes(query.toLowerCase()))
      : this.products;
  }

  toggleActions(productId: number) {
    this.actionsOpen[productId] = !this.actionsOpen[productId];
  }

  lowStock(product: ProductResponse) {
    if (!product.stockQuantity) return false;
    return product.stockQuantity <= 10;
  }

  expired(product: ProductResponse) {
    if (!product.expiryDate) return false;
    const expiry = new Date(product.expiryDate);
    const now = new Date();
    const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays;
  
  }

    isEditOpen = false;
    selectedProduct: any = null;

    closeEdit() {
      this.isEditOpen = false;
      this.selectedProduct = null;
    }

  // Action handlers
  //edit(product: ProductResponse){}
  edit(product: any) {
    // this.isActionsOpen = false; // if you have dropdown state
    this.selectedProduct = product;
    this.isEditOpen = true;
  }

  reorder(product: ProductResponse) { console.log('Reorder', product); }
  auditStock(product: ProductResponse) { console.log('Audit Stock', product); }
  createStockAlert(product: ProductResponse) { console.log('Create Stock Alert', product); }
  stockHistory(product: ProductResponse) { console.log('Stock History', product); }


  get totalProducts(): number {
    return this.products.length;
  }

  get outOfStockProducts(): number {
    return this.products.filter(p => (p.stockQuantity ?? 0) === 0).length;
  }

  get expiredProducts(): number {
    const today = new Date();
    return this.products.filter(p =>
      p.expiryDate && new Date(p.expiryDate) < today
    ).length;
  }

  addProduct(){
    this.router.navigate(['admin/medicine/add'])
  }

  showAddProductModal = false;

//   addProduct() {
//   this.showAddProductModal = true;
// }

closeAddProduct() {
  this.showAddProductModal = false;
}



}
