import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

import {LucideAngularModule} from "lucide-angular/src/icons";
import {Edit2, PlusCircle, Trash2} from "lucide-angular";
import {ProductCategory} from "../../../services/models/product-category";
import {ProductCategoryControllerService} from "../../../services/services/product-category-controller.service";
import {ProductCategoryRequest} from "../../../services/models/product-category-request";
import {CategoryService} from "../../../cart/cart-modal/category.service";

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css'
})
export class AdminCategoryComponent{
  private categoryService = inject(ProductCategoryControllerService);


  category: ProductCategory[] =[]
  selectedFile: File | null = null;
  newCategory: ProductCategoryRequest = {  };
  categories = inject(CategoryService);

  // Add new category
  addCategory(category: ProductCategoryRequest, file: File | null) {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(category)], { type: 'application/json' }));
    if (file) formData.append('image', file);

    this.categoryService.createProductCategory({body: formData as any}).subscribe({
      next: (added) => {
        console.log('Category added', added);
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

  editCategory(category: ProductCategory){
    this.newCategory = {
      id: category.id,
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

    this.categoryService.updateProductCategory({body: formData as any}).subscribe({
      next: (updatedCategory) =>{
        alert("Category updated")
      }
    })
  }

  // Lucide icons
  PlusCircle = PlusCircle;
  Edit2 = Edit2;
  Trash2 = Trash2;

}
