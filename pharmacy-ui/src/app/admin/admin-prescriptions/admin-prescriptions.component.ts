import { Component, OnInit, inject } from '@angular/core';
import {PrescriptionControllerService} from "../../services/services/prescription-controller.service";
import {PrescriptionResponse} from "../../services/models/prescription-response";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {PrescriptionItemRequest} from "../../services/models/prescription-item-request";
import {MedicineApIsService} from "../../services/services/medicine-ap-is.service";
import {ProductResponse} from "../../services/models/product-response";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin-prescriptions',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './admin-prescriptions.component.html'
})
export class AdminPrescriptionsComponent implements OnInit {
  private prescriptionService = inject(PrescriptionControllerService);
  private productService = inject(MedicineApIsService);


  prescriptions: PrescriptionResponse[] = [];
  loading = false;
  selectedProducts: { productId: number; quantity: number }[] = [];
  availableProducts: ProductResponse[] | undefined = [];
  newProductId: number | null = null;
  newQuantity: number = 1;

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadProducts();
  }

  loadPrescriptions() {
    this.loading = true;

    this.prescriptionService.getAllPrescriptions().subscribe({
      next: (data) => {
        this.prescriptions = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadProducts(){
    this.productService.getAllMedicines().subscribe({
      next: (products) => {
        this.availableProducts = products.content
      }
    })
  }

  addProduct() {
    if (!this.newProductId || this.newQuantity < 1) return;

    const exists = this.selectedProducts.find(p => p.productId === this.newProductId);
    if (exists) {
      exists.quantity += this.newQuantity;
    } else {
      this.selectedProducts.push({ productId: this.newProductId, quantity: this.newQuantity });
    }

    this.newProductId = null;
    this.newQuantity = 1;
  }

  removeProduct(productId: number) {
    this.selectedProducts = this.selectedProducts.filter(p => p.productId !== productId);
  }

  getProductName(productId: number) {
    const prod = this.availableProducts?.find(p => p.productId === productId);
    return prod ? prod.name : '';
  }

  approve(id: number) {
    if (this.selectedProducts.length === 0) {
      alert('Add at least one product before approving');
      return;
    }

    const payload: PrescriptionItemRequest[] = this.selectedProducts.map(p => ({
      prescriptions: { id },
      product: { id: p.productId },
      quantity: p.quantity
    }));

    this.prescriptionService.approvePrescription({ id: id, body: payload}).subscribe(() => {
      this.selectedProducts = []
      this.loadPrescriptions();
      alert('Prescription approved');
    });
  }

  // reject(id: number) {
  //   this.prescriptionService.rejectPrescription(id).subscribe(() => {
  //     this.loadPrescriptions();
  //     alert('Prescription rejected');
  //   });
  // }

}
