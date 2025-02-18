import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MedicineService} from "../services/services/medicine.service";
import {PageResponseMedicineResponse} from "../services/models/page-response-medicine-response";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MedicineRequest} from "../services/models/medicine-request";

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent implements OnInit {

  medicineRespone: PageResponseMedicineResponse ={}
  page =0;
  size=5;

  medicineTypes = ['SYRUP', 'TABLETS', 'OINTMENTS'];

  medicine: MedicineRequest = {
    description: '',
    expiryDate: '',
    manufacturer: '',
    name: '',
    price: 0,
    stockQuantity: 0,
    type: undefined
  };

  constructor(
    private router: Router,
    private medicineService: MedicineService
  ) {
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']); // Redirect to login if no token
    } else {
      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      if (!user.roles.includes('ADMIN')) {
        this.router.navigate(['/unauthorized']); // Redirect unauthorized users
      }
    }
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

  onSubmit() {
    this.medicineService.createMedicine({
      body: this.medicine
    }).subscribe()

  }

}
