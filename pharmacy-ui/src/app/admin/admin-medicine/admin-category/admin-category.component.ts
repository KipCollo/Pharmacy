import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

import { LucideAngularModule } from "lucide-angular/src/icons";
import { Edit2, PlusCircle, Trash2 } from "lucide-angular";
import { ProductCategory } from "../../../services/models/product-category";
import { ProductCategoryControllerService } from "../../../services/services/product-category-controller.service";
import { ProductCategoryRequest } from "../../../services/models/product-category-request";
import { CategoryService } from "../../../cart/cart-modal/category.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductCategoryResponse } from '../../../services/models';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css'
})
export class AdminCategoryComponent {
  private categoryService = inject(ProductCategoryControllerService);
  private _snackBar = inject(MatSnackBar);
  categories = inject(CategoryService);

  category = signal<ProductCategory[]>([]);
  selectedFile: File | null = null;
  newCategory: ProductCategoryRequest = {};

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,
      {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 1000
      }
    );
  }


  // Add new category
  addCategory(category: ProductCategoryRequest, file: File | null) {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(category)], { type: 'application/json' }));
    if (file) formData.append('image', file);

    this.categoryService.createProductCategory({ body: formData as any }).subscribe({
      next: () => {
        this.openSnackBar('Category added successfully!', 'Close');
      },
      error: (err) => console.error(err)
    });
  }


  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  editCategory(category: ProductCategoryResponse) {
    this.newCategory = {
      // id: category.categoryId,
      name: category.name,
      image: category.image,
      description: category.description
    }
  }

  updateCategory(category: ProductCategoryRequest, file: File | null) {

    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));
    if (file) {
      formData.append('image', file);
    }

    this.categoryService.updateProductCategory({ body: formData as any }).subscribe({
      next: () => {
        this.category.update(list => list.map(cat => cat.categoryId === category.id ? { ...cat, ...category } : cat));
        this.openSnackBar('Category updated successfully!', 'Close');
      }
    })
  }

  // Lucide icons
  PlusCircle = PlusCircle;
  Edit2 = Edit2;
  Trash2 = Trash2;

}
