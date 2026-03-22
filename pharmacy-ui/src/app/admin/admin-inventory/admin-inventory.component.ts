import { Component, OnInit, signal, inject } from '@angular/core';
import { ProductResponse } from '../../services/models/product-response';
import { PurchaseProductRequest } from '../../services/models/purchase-product-request';
import { CommonModule } from '@angular/common';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.css'
})
export class AdminInventoryComponent implements OnInit {
  private medicineService = inject(MedicineApIsService);
  private router = inject(Router);
  private readonly imagePlaceholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect width="56" height="56" rx="10" fill="%23e5e7eb"/><path d="M17 36l8-8 6 6 8-10 6 12H17z" fill="%239ca3af"/><circle cx="22" cy="20" r="4" fill="%239ca3af"/></svg>';

  products: ProductResponse[] = [];
  searchQuery = signal('');
  actionsOpen: { [id: number]: boolean } = {};
  actionMessage = '';
  actionMessageType: 'success' | 'error' = 'success';
  reorderLoading: { [id: number]: boolean } = {};

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

  stockPercent(stock: number): number {
    const maxStock = Math.max(...this.products.map((product) => product.stockQuantity ?? 0), 1);
    return Math.max(5, Math.min(100, (stock / maxStock) * 100));
  }

  supplierColor(supplier?: string): string {
    const value = supplier?.trim();
    if (!value) {
      return '#9ca3af';
    }

    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);
    return `hsl(${hue} 70% 45%)`;
  }

  productImage(image?: string): string {
    return image ? `data:image/jpeg;base64,${image}` : this.imagePlaceholder;
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

  // Audit Stock Modal
  isAuditStockOpen = false;
  auditStockProduct: ProductResponse | null = null;
  adjustmentType = 'quantity';
  physicalCount = '';
  adjustmentReasons = {
    damage: false,
    expiration: false,
    misplacement: false,
    thief: false,
    stocktakeVariance: false,
    custom: false
  };
  noteText = '';

  openAuditStock(product: ProductResponse) {
    this.auditStockProduct = product;
    this.isAuditStockOpen = true;
    this.actionsOpen[product.productId!] = false;
  }

  closeAuditStock() {
    this.isAuditStockOpen = false;
    this.auditStockProduct = null;
    this.resetAuditForm();
  }

  resetAuditForm() {
    this.adjustmentType = 'quantity';
    this.physicalCount = '';
    this.noteText = '';
    this.adjustmentReasons = {
      damage: false,
      expiration: false,
      misplacement: false,
      thief: false,
      stocktakeVariance: false,
      custom: false
    };
  }

  getDiscrepancy(): number {
    if (!this.physicalCount || !this.auditStockProduct) {
      return 0;
    }
    const physical = parseInt(this.physicalCount) || 0;
    const available = this.auditStockProduct.stockQuantity ?? 0;
    return physical - available;
  }

  saveAuditStock() {
    console.log('Save Audit Stock', {
      product: this.auditStockProduct,
      adjustmentType: this.adjustmentType,
      physicalCount: this.physicalCount,
      adjustmentReasons: this.adjustmentReasons,
      note: this.noteText
    });
    this.closeAuditStock();
  }

  reorder(product: ProductResponse) {
    if (!product.productId) {
      this.actionMessageType = 'error';
      this.actionMessage = 'Unable to reorder this item because product ID is missing.';
      return;
    }

    const quantity = this.getReorderQuantity(product);
    const payload: PurchaseProductRequest[] = [
      {
        productId: product.productId,
        quantity
      }
    ];

    this.reorderLoading[product.productId] = true;
    this.actionsOpen[product.productId] = false;

    this.medicineService.purchaseProducts({ body: payload }).subscribe({
      next: () => {
        this.actionMessageType = 'success';
        this.actionMessage = `Reordered ${quantity} units for ${product.name ?? 'product'}.`;
        this.reorderLoading[product.productId!] = false;
        this.loadProducts();
      },
      error: () => {
        this.actionMessageType = 'error';
        this.actionMessage = `Failed to reorder ${product.name ?? 'product'}. Please try again.`;
        this.reorderLoading[product.productId!] = false;
      }
    });
  }

  getReorderQuantity(product: ProductResponse): number {
    const currentStock = product.stockQuantity ?? 0;
    const targetStock = 100;
    const needed = targetStock - currentStock;
    return Math.max(needed, 20);
  }
  auditStock(product: ProductResponse) { this.openAuditStock(product); }
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

  addProduct() {
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
