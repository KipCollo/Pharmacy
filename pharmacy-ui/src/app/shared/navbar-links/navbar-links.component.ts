import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { Headset, LucideAngularModule, ChevronDown, Flame, MapPin } from "lucide-angular/src/icons";
import { HealthConditionControllerService } from "../../services/services/health-condition-controller.service";
import { HealthConditionResponse } from "../../services/models/health-condition-response";
import { ProductCategoryResponse } from "../../services/models/product-category-response";
import { ProductCategoryControllerService } from "../../services/services/product-category-controller.service";

@Component({
  selector: 'app-navbar-links',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    SlicePipe
  ],
  templateUrl: './navbar-links.component.html',
  styleUrl: './navbar-links.component.css'
})
export class NavbarLinksComponent implements OnInit {
  private conditionService = inject(HealthConditionControllerService);
  private medicineCategory = inject(ProductCategoryControllerService);

  @Input() isLoggedIn: boolean = false;
  condition: HealthConditionResponse[] = []
  productCategory: Array<ProductCategoryResponse> = [];

  readonly icons = {
    Headset,
    ChevronDown,
    Flame,
    MapPin
  }
  ngOnInit() {
    this.getHealthConditions();
    this.getProductCategory()
  }

  getHealthConditions() {
    this.conditionService.getAllConditions().subscribe({
      next: (conditions) => {
        this.condition = conditions;
      }
    })
  }

  getProductCategory() {
    this.medicineCategory.getProductCategory().subscribe({
      next: (category) => {
        this.productCategory = category;
      }
    }
    )
  }



}
