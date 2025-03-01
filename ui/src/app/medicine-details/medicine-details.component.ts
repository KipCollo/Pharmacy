import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicineService } from '../services/services';
import { MedicineResponse } from '../services/models';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-medicine-details',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './medicine-details.component.html',
  styleUrl: './medicine-details.component.css'
})
export class MedicineDetailsComponent implements OnInit{

  medicine: MedicineResponse ={};

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineService
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.medicineService.getMedicineById(id).subscribe(data => {
        this.medicine = data;
      });
    }
  }


}
