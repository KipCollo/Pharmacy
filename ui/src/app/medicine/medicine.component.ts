import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MedicineService} from "../services/services/medicine.service";

import {FormsModule} from "@angular/forms";
import {MedicineRequest} from "../services/models/medicine-request";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [

    FormsModule,
    NgForOf
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent implements OnInit{



  medicineTypes = ['SYRUP', 'TABLETS', 'OINTMENTS'];

  medicine: MedicineRequest = {
    description: '',
    expiryDate: '',
    manufacturer: '',
    name: '',
    price: 0,
    stockQuantity: 0,
    type: 'SYRUP',
    //imageFile: null,
   // imageUrl: ''
  };

  constructor(
    private router: Router,
    private medicineService: MedicineService
  ) {
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
     // this.medicine.imageFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
       // this.medicine.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

    const formData = new FormData();
    // formData.append('name', this.medicine.name);
    // formData.append('description', this.medicine.description);
    // formData.append('manufacturer', this.medicine.manufacturer);
    // formData.append('expiryDate', this.medicine.expiryDate);
    // formData.append('price', this.medicine.price.toString());
    // formData.append('stockQuantity', this.medicine.stockQuantity.toString());
    // formData.append('type', this.medicine.type);

    // if (this.medicine.imageFile) {
    //   formData.append('image', this.medicine.imageFile);
    // }


    this.medicineService.createMedicine({
      body: this.medicine
    }).subscribe()

  }

}
