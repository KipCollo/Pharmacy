import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit{

  inventoryList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.http.get<any[]>('/api/inventory').subscribe(data => {
      this.inventoryList = data;
    });
  }

  updateStock(medicineId: number, quantity: number) {
    this.http.put(`/api/inventory/${medicineId}?quantity=${quantity}`, {}).subscribe(() => {
      this.loadInventory();
    });
  }
}
