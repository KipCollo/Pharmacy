import { Component, OnInit } from '@angular/core';
import {NgForOf} from "@angular/common";
import { PageResponseProductResponse} from '../services/models';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from '../services/interceptor/http-token.interceptor';
import {MedicineApIsService} from "../services/services/medicine-ap-is.service";

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [ NgForOf],
  providers: [
    {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpTokenInterceptor,
          multi: true
        }
  ],
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.css'
})
export class MedicineListComponent{

  medicineResponse: PageResponseProductResponse ={}
  page =0;
  size=5;

  constructor(
    private medicineService: MedicineApIsService
  ) {
  }

  ngOnInit(): void {
    this.findAllMedicine();
  }

  private findAllMedicine() {
    this.medicineService.getAllMedicines({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (product) => {
        this.medicineResponse = product
      }
    })
  }
}
