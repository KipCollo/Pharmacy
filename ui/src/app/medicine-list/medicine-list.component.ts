import { Component, OnInit } from '@angular/core';
import {NgForOf} from "@angular/common";
import { MedicineService } from '../services/services/medicine.service';
import { PageResponseMedicineResponse } from '../services/models/page-response-medicine-response';
import { MedicineResponse } from '../services/models';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from '../services/interceptor/http-token.interceptor';

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

  medicineResponse: PageResponseMedicineResponse ={}
  page =0;
  size=5;

  constructor(
    private medicineService: MedicineService
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
      next: (medicine) => {
        this.medicineResponse = medicine
      }
    })
  }
}
