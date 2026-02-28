import { NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {Heart, LucideAngularModule, MapPin, ShoppingCart} from "lucide-angular/src/icons";
import {FilePlusCorner} from "lucide-angular";
import {HealthCondition} from "../../services/models/health-condition";
import {MedicineApIsService} from "../../services/services/medicine-ap-is.service";
import {HealthConditionControllerService} from "../../services/services/health-condition-controller.service";
import {HealthConditionResponse} from "../../services/models/health-condition-response";
import {ProductResponse} from "../../services/models/product-response";
import {ProductCategoryResponse} from "../../services/models/product-category-response";
import {ProductCategoryControllerService} from "../../services/services/product-category-controller.service";

@Component({
  selector: 'app-navbar-links',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './navbar-links.component.html',
  styleUrl: './navbar-links.component.css'
})
export class NavbarLinksComponent implements OnInit{
  private conditionService = inject(HealthConditionControllerService);
  private medicineCategory = inject(ProductCategoryControllerService);

  @Input() isLoggedIn: boolean = false;
  condition: HealthConditionResponse[] =[]
  productCategory: Array<ProductCategoryResponse> =[];

  readonly icons = {
    FilePlusCorner,
    MapPin
  }
  ngOnInit() {
    this.getHealthConditions();
    this.getProductCategory()
  }

  getHealthConditions(){
    this.conditionService.getAllConditions().subscribe({
      next: (conditions) => {
        this.condition = conditions;
      }
    })
  }

  getProductCategory(){
    this.medicineCategory.getProductCategory().subscribe({
        next: (category) =>{
          this.productCategory = category;
        }
      }
    )
  }



}
