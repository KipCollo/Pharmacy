import { Component, OnInit, signal, inject } from '@angular/core';
import { ProductResponse } from '../../services/models/product-response';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { MedicineApIsService } from '../../services/services/medicine-ap-is.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import {LucideAngularModule} from "lucide-angular/src/icons";
import {Edit2, PlusCircle, Trash2} from "lucide-angular";
import {Product} from "../../services/models/product";

@Component({
  selector: 'app-admin-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-medicine.component.html',
  styleUrl: './admin-medicine.component.css'
})
export class AdminMedicineComponent implements OnInit{
  private medicineService = inject(MedicineApIsService);
  private router = inject(Router);

  products = signal<ProductResponse[]>([]);
  searchQuery = signal('');
  actionsOpen: { [id: number]: boolean } = {};
  newProduct: Product = { };

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

  // Action handlers
  //edit(product: ProductResponse){}
  edit(product: any) {
    // this.isActionsOpen = false; // if you have dropdown state
    this.selectedProduct = product;
    this.isEditOpen = true;
  }

  addProduct(){
    this.router.navigate(['admin/medicine/add'])
  }

  // Delete product
  deleteProduct(id: number) {
    const backup = this.products();

    this.products.update(list => list.filter(i => i.productId !== id));

    this.medicineService.deleteMedicine({id: id}).subscribe({
      next: () =>{
        alert("Product Deleted")
      },
      error: () => {
        console.error('Delete failed, rolling back');
        this.products.set(backup); // rollback
      }
    })
  }

  // Edit product
  editProduct(product: Product) {
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
    this.newProduct = { };
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
}
