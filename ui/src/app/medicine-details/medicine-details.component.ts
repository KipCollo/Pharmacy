import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import {ProductResponse} from "../services/models/product-response";
import {MedicineApIsService} from "../services/services/medicine-ap-is.service";

@Component({
  selector: 'app-medicine-details',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './medicine-details.component.html',
  styleUrl: './medicine-details.component.css'
})
export class MedicineDetailsComponent implements OnInit{

  medicine: ProductResponse ={};

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineApIsService
  ) {}


  ngOnInit(): void {
    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    //   this.medicineService.getMedicineById(id).subscribe(data => {
    //     this.medicine = data;
    //   });
    // }
  }


}
