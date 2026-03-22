import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ProductResponse } from '../../services/models/product-response';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from "lucide-angular/src/icons";
import { Edit2, PlusCircle, Trash2, Grid3x3, List, Check } from "lucide-angular";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-medicine.component.html',
  styleUrl: './admin-medicine.component.css'
})
export class AdminMedicineComponent implements OnInit {
  private medicineService = inject(MedicineApIsService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  products = signal<ProductResponse[]>([]);
  searchQuery = signal('');
  viewMode = signal<'list' | 'card'>('card'); // Default to card view
  activeFilter = signal<'all' | 'active' | 'draft' | 'archived'>('all');
  showAdvancedFilter = signal(false);
  showViewSettings = signal(false);
  showCategoryFilter = signal(false);
  showTypeFilter = signal(false);

  // Computed filtered products based on activeFilter
  filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const allProducts = this.products();

    switch (filter) {
      case 'active':
        // Show all products that are active (not archived/draft)
        return allProducts.filter(p => !p.category?.name || p.category?.name === 'Active');
      case 'draft':
        return allProducts.filter(p => p.category?.name === 'Draft');
      case 'archived':
        return allProducts.filter(p => p.category?.name === 'Archived');
      default:
        return allProducts;
    }
  });

  // Computed counts for each filter
  activeCount = computed(() => {
    return this.products().filter(p => !p.category?.name || p.category?.name === 'Active').length;
  });

  draftCount = computed(() => {
    return this.products().filter(p => p.category?.name === 'Draft').length;
  });

  archivedCount = computed(() => {
    return this.products().filter(p => p.category?.name === 'Archived').length;
  });

  actionsOpen: { [id: number]: boolean } = {};
  newProduct: Partial<ProductResponse> = {};
  message: string = 'Product Deleted successfully!';
  action: string = 'Close';

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,
      {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 1000
      }
    );
  }


  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.medicineService.getAllMedicines({ page: 0, size: 1000 }).subscribe({
      next: (res) => {
        this.products.set(res.content || []);
      },
      error: (err) => console.error(err)
    });
  }

  isEditOpen = false;
  selectedProduct: any = null;

  closeEdit() {
    this.isEditOpen = false;
    this.selectedProduct = null;
  }

  openProductPanel(product: ProductResponse) {
    this.actionsOpen = {};
    this.selectedProduct = {
      ...product,
      category: product.category ? { ...product.category } : undefined
    };
    this.isEditOpen = true;
  }

  // Action handlers
  //edit(product: ProductResponse){}
  edit(product: any) {
    this.openProductPanel(product);
  }

  onRowClick(product: ProductResponse) {
    this.openProductPanel(product);
  }

  onCardClick(product: ProductResponse) {
    this.openProductPanel(product);
  }

  toggleActions(productId: number, event: Event) {
    event.stopPropagation();
    const currentlyOpen = !!this.actionsOpen[productId];
    this.actionsOpen = {};
    this.actionsOpen[productId] = !currentlyOpen;
  }

  saveSelectedProduct() {
    if (!this.selectedProduct?.productId) {
      return;
    }

    const updated = this.selectedProduct as ProductResponse;
    this.applySpecialOfferPrice(updated);
    this.products.update((list) =>
      list.map((item) => (item.productId === updated.productId ? { ...item, ...updated } : item))
    );

    this.openSnackBar('Product updated successfully!', this.action);
    this.closeEdit();
  }

  addProduct() {
    this.showAddProductModal = true;
    this.newProduct = {};
  }

  submitNewProduct() {
    this.applySpecialOfferPrice(this.newProduct as ProductResponse);

    const nextId = Math.max(0, ...this.products().map(p => p.productId ?? 0)) + 1;

    const created: ProductResponse = {
      productId: nextId,
      name: this.newProduct.name,
      manufacturer: this.newProduct.manufacturer,
      price: this.newProduct.price,
      originalPrice: this.newProduct.originalPrice,
      discount: this.newProduct.discount,
      newArrival: this.newProduct.newArrival,
      trending: this.newProduct.trending,
      stockQuantity: this.newProduct.stockQuantity,
      description: this.newProduct.description,
      type: this.newProduct.type as ProductResponse['type']
    };

    this.products.update((list) => [created, ...list]);
    this.openSnackBar('Product added successfully!', this.action);
    this.closeAddProduct();
    this.resetForm();
  }

  // Delete product
  deleteProduct(id: number) {
    const backup = this.products();

    this.products.update(list => list.filter(i => i.productId !== id));

    this.medicineService.deleteMedicine({ id: id }).subscribe({
      next: () => {
        if (this.selectedProduct?.productId === id) {
          this.closeEdit();
        }
        this.openSnackBar(this.message, this.action);
      },
      error: () => {
        console.error('Delete failed, rolling back');
        this.products.set(backup); // rollback
      }
    })
  }

  // Edit product
  editProduct(product: ProductResponse) {
    this.newProduct = { ...product };
  }

  // Update existing product
  updateProduct() {
    // this.products.set(
    //   this.products.map(p => (p.id === this.newProduct.id ? this.newProduct : p))
    // );
    this.resetForm();
  }

  // Reset form
  private resetForm() {
    this.newProduct = {};
  }

  isSpecialOffer(product: Partial<ProductResponse> | null | undefined): boolean {
    if (!product) {
      return false;
    }
    return !!product.discount && product.discount > 0;
  }

  setSpecialOffer(product: Partial<ProductResponse> | null | undefined, enabled: boolean) {
    if (!product) {
      return;
    }

    if (enabled) {
      if (!product.originalPrice || product.originalPrice <= 0) {
        product.originalPrice = product.price ?? 0;
      }
      if (!product.discount || product.discount <= 0) {
        product.discount = 10;
      }
      this.applySpecialOfferPrice(product);
      return;
    }

    if (product.originalPrice && product.originalPrice > 0) {
      product.price = product.originalPrice;
    }
    product.discount = 0;
    product.originalPrice = undefined;
  }

  onOfferInputChange(product: Partial<ProductResponse> | null | undefined) {
    if (!product) {
      return;
    }

    if (!product.originalPrice || product.originalPrice < 0) {
      product.originalPrice = 0;
    }
    if (!product.discount || product.discount < 0) {
      product.discount = 0;
    }
    if ((product.discount ?? 0) > 95) {
      product.discount = 95;
    }
    this.applySpecialOfferPrice(product);
  }

  private applySpecialOfferPrice(product: Partial<ProductResponse>) {
    if (!product.discount || product.discount <= 0) {
      return;
    }

    const base = product.originalPrice ?? product.price ?? 0;
    product.originalPrice = base;
    product.price = Math.max(0, Number((base * (1 - product.discount / 100)).toFixed(2)));
  }

  showAddProductModal = false;

  //   addProduct() {
  //   this.showAddProductModal = true;
  // }

  closeAddProduct() {
    this.showAddProductModal = false;
  }

  protected readonly PlusCircle = PlusCircle;
  protected readonly Edit2 = Edit2;
  protected readonly Trash2 = Trash2;
  protected readonly Grid3x3 = Grid3x3;
  protected readonly List = List;
  protected readonly Check = Check;
}
