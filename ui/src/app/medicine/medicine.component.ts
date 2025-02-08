import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MedicineService} from "../services/services/medicine.service";
import {PageResponseMedicineResponse} from "../services/models/page-response-medicine-response";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent implements OnInit {

  medicineRespone: PageResponseMedicineResponse ={}
  page =0;
  size=5;

  constructor(
    private router: Router,
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
      next: (medicines) => {
        this.medicineRespone = medicines
      }
    })
  }
}
