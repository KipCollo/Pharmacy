import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LucideAngularModule } from 'lucide-angular/src/icons';
import { Edit2, Grid3x3, List, PlusCircle, Trash2 } from 'lucide-angular';
import { ProductCategoryControllerService } from '../../../services/services/product-category-controller.service';
import { ProductCategoryRequest } from '../../../services/models/product-category-request';
import { CategoryService } from '../../../cart/cart-modal/category.service';
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

  viewMode = signal<'card' | 'list'>('card');
  searchQuery = signal('');
  isEditOpen = false;
  showAddCategoryModal = false;
  actionsOpen: { [id: number]: boolean } = {};

  selectedCategory: ProductCategoryResponse | null = null;
  selectedFile: File | null = null;
  newCategory: ProductCategoryRequest = {};

  filteredCategories = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const all = this.categories.productCategory();

    if (!query) {
      return all;
    }

    return all.filter((category) => {
      const name = (category.name ?? '').toLowerCase();
      const description = (category.description ?? '').toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  });

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,
      {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 1000
      }
    );
  }


  openAddModal() {
    this.newCategory = {};
    this.selectedFile = null;
    this.showAddCategoryModal = true;
  }

  closeAddModal() {
    this.showAddCategoryModal = false;
    this.newCategory = {};
    this.selectedFile = null;
  }

  addCategory(category: ProductCategoryRequest) {
    if (!this.selectedFile) {
      this.openSnackBar('Please choose an image before saving.', 'Close');
      return;
    }

    this.categoryService.createProductCategory({
      body: {
        product: category,
        image: this.selectedFile
      }
    }).subscribe({
      next: () => {
        this.categories.loadProductCategory();
        this.openSnackBar('Category added successfully!', 'Close');
        this.closeAddModal();
      },
      error: (err) => console.error(err)
    });
  }


  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.newCategory.image = result.includes(',') ? result.split(',')[1] : result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openEditPanel(category: ProductCategoryResponse) {
    this.actionsOpen = {};
    this.selectedCategory = { ...category };
    this.isEditOpen = true;
  }

  closeEditPanel() {
    this.isEditOpen = false;
    this.selectedCategory = null;
  }

  editCategory(category: ProductCategoryResponse, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.openEditPanel(category);
  }

  updateCategory() {
    if (!this.selectedCategory || this.selectedCategory.id == null) {
      return;
    }

    const payload: ProductCategoryRequest = {
      id: this.selectedCategory.id,
      name: this.selectedCategory.name,
      description: this.selectedCategory.description,
      image: this.selectedCategory.image
    };

    this.categoryService.updateProductCategory({
      body: {
        category: payload,
        image: this.selectedFile ?? undefined
      }
    }).subscribe({
      next: () => {
        this.categories.productCategory.update((list) =>
          list.map((cat) => (cat.id === payload.id ? { ...cat, ...payload } : cat))
        );
        this.openSnackBar('Category updated successfully!', 'Close');
        this.closeEditPanel();
      }
    });
  }

  deleteCategory(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.categories.productCategory.update((list) => list.filter((cat) => cat.id !== id));
    if (this.selectedCategory?.id === id) {
      this.closeEditPanel();
    }
    this.openSnackBar('Category removed locally.', 'Close');
  }

  onCategoryRowClick(category: ProductCategoryResponse) {
    this.openEditPanel(category);
  }

  onCategoryCardClick(category: ProductCategoryResponse) {
    this.openEditPanel(category);
  }

  toggleActions(id: number, event: Event) {
    event.stopPropagation();
    const isOpen = !!this.actionsOpen[id];
    this.actionsOpen = {};
    this.actionsOpen[id] = !isOpen;
  }

  // Lucide icons
  protected readonly PlusCircle = PlusCircle;
  protected readonly Edit2 = Edit2;
  protected readonly Trash2 = Trash2;
  protected readonly Grid3x3 = Grid3x3;
  protected readonly List = List;

}
