import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MedicineService} from "../services/services/medicine.service";

import {FormsModule} from "@angular/forms";
import {MedicineRequest} from "../services/models/medicine-request";

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [
   
    FormsModule
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent implements OnInit {

  

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
   
  }


  onSubmit() {
    this.medicineService.createMedicine({
      body: this.medicine
    }).subscribe()

  }

}
