import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PrescriptionControllerService } from "../../services/services/prescription-controller.service";
import { PrescriptionResponse } from "../../services/models/prescription-response";
import { DatePipe } from "@angular/common";
import { PrescriptionItemRequest } from "../../services/models/prescription-item-request";
import { MedicineApIsService } from "../../services/services/medicine-ap-is.service";
import { ProductResponse } from "../../services/models/product-response";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-admin-prescriptions',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './admin-prescriptions.component.html',
  styleUrl: './admin-prescriptions.component.css'
})
export class AdminPrescriptionsComponent implements OnInit {
  private prescriptionService = inject(PrescriptionControllerService);
  private productService = inject(MedicineApIsService);
  private http = inject(HttpClient);


  prescriptions: PrescriptionResponse[] = [];
  selectedDateFilter = '';
  activePrescription: PrescriptionResponse | null = null;
  loading = false;
  submittingByPrescription: Record<number, boolean> = {};
  selectedProductsByPrescription: Record<number, { productId: number; quantity: number }[]> = {};
  availableProducts: ProductResponse[] | undefined = [];
  draftProductIdByPrescription: Record<number, number | null> = {};
  draftQuantityByPrescription: Record<number, number> = {};

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadProducts();
  }

  loadPrescriptions() {
    this.loading = true;

    this.prescriptionService.getAllPrescriptions().subscribe({
      next: (data) => {
        this.prescriptions = data;
        this.initializeSelectedProducts();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadProducts() {
    this.productService.getAllMedicines().subscribe({
      next: (products) => {
        this.availableProducts = products.content
      }
    })
  }

  get filteredPrescriptions(): PrescriptionResponse[] {
    const sorted = [...this.prescriptions].sort((a, b) => {
      const aTime = new Date(a.uploadedAt ?? 0).getTime();
      const bTime = new Date(b.uploadedAt ?? 0).getTime();
      return bTime - aTime;
    });

    if (!this.selectedDateFilter) {
      return sorted;
    }

    return sorted.filter(p => this.matchesSelectedDate(p.uploadedAt));
  }

  matchesSelectedDate(uploadedAt?: string): boolean {
    if (!uploadedAt || !this.selectedDateFilter) {
      return false;
    }

    return new Date(uploadedAt).toISOString().slice(0, 10) === this.selectedDateFilter;
  }

  openPrescriptionModal(prescription: PrescriptionResponse): void {
    this.activePrescription = prescription;
  }

  closePrescriptionModal(): void {
    this.activePrescription = null;
  }

  getUploaderName(prescription: PrescriptionResponse): string {
    const fullName = `${prescription.user?.firstName ?? ''} ${prescription.user?.lastName ?? ''}`.trim();
    if (fullName) {
      return fullName;
    }

    return prescription.user?.name || prescription.user?.username || prescription.user?.email || 'Unknown uploader';
  }

  initializeSelectedProducts() {
    for (const prescription of this.prescriptions) {
      if (!prescription.id) {
        continue;
      }

      const mapped = (prescription.prescriptionItem ?? [])
        .filter(item => !!item.product?.id)
        .map(item => ({
          productId: item.product!.id!,
          quantity: item.quantity && item.quantity > 0 ? item.quantity : 1
        }));

      this.selectedProductsByPrescription[prescription.id] = mapped;
      this.draftQuantityByPrescription[prescription.id] = this.draftQuantityByPrescription[prescription.id] ?? 1;
      this.submittingByPrescription[prescription.id] = false;
    }
  }

  getSelectedProducts(prescriptionId: number): { productId: number; quantity: number }[] {
    return this.selectedProductsByPrescription[prescriptionId] ?? [];
  }

  getDraftProductId(prescriptionId: number): number | null {
    return this.draftProductIdByPrescription[prescriptionId] ?? null;
  }

  getDraftQuantity(prescriptionId: number): number {
    return this.draftQuantityByPrescription[prescriptionId] ?? 1;
  }

  setDraftProductId(prescriptionId: number, productId: number | null) {
    this.draftProductIdByPrescription[prescriptionId] = productId;
  }

  setDraftQuantity(prescriptionId: number, quantity: number) {
    this.draftQuantityByPrescription[prescriptionId] = quantity;
  }

  addProduct(prescriptionId: number) {
    const newProductId = this.getDraftProductId(prescriptionId);
    const newQuantity = this.getDraftQuantity(prescriptionId);

    if (!newProductId || newQuantity < 1) return;

    const selectedProducts = this.getSelectedProducts(prescriptionId);

    const exists = selectedProducts.find(p => p.productId === newProductId);
    if (exists) {
      exists.quantity += newQuantity;
    } else {
      selectedProducts.push({ productId: newProductId, quantity: newQuantity });
    }

    this.selectedProductsByPrescription[prescriptionId] = selectedProducts;

    this.draftProductIdByPrescription[prescriptionId] = null;
    this.draftQuantityByPrescription[prescriptionId] = 1;
  }

  removeProduct(prescriptionId: number, productId: number) {
    const selectedProducts = this.getSelectedProducts(prescriptionId);
    this.selectedProductsByPrescription[prescriptionId] = selectedProducts.filter(
      p => p.productId !== productId
    );
  }

  getProductName(productId: number) {
    const prod = this.availableProducts?.find(p => p.productId === productId);
    return prod ? prod.name : '';
  }

  isSubmitting(prescriptionId: number): boolean {
    return this.submittingByPrescription[prescriptionId] ?? false;
  }

  isApproved(prescription: PrescriptionResponse): boolean {
    return prescription.status === 'APPROVED';
  }

  statusClass(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): string {
    if (status === 'APPROVED') {
      return 'status-approved';
    }
    if (status === 'REJECTED') {
      return 'status-rejected';
    }
    return 'status-pending';
  }

  approve(id: number) {
    const selectedProducts = this.getSelectedProducts(id);

    if (selectedProducts.length === 0) {
      alert('Add at least one product before approving');
      return;
    }

    this.submittingByPrescription[id] = true;

    const payload: PrescriptionItemRequest[] = selectedProducts.map(p => ({
      prescriptions: { id },
      product: { id: p.productId },
      quantity: p.quantity
    }));

    this.prescriptionService.approvePrescription({ id: id, body: payload }).subscribe({
      next: () => {
        this.closePrescriptionModal();
        this.loadPrescriptions();
        alert('Prescription approved');
      },
      error: (err) => {
        const apiMessage = err?.error?.errorDescription || err?.error?.message;
        alert(apiMessage || 'Failed to approve prescription');
      },
      complete: () => {
        this.submittingByPrescription[id] = false;
      }
    });
  }

  reject(id: number) {
    this.submittingByPrescription[id] = true;
    this.http.put(`/api/prescriptions/${id}/review?approved=false`, []).subscribe({
      next: () => {
        this.selectedProductsByPrescription[id] = [];
        this.closePrescriptionModal();
        this.loadPrescriptions();
        alert('Prescription rejected');
      },
      error: (err) => {
        const apiMessage = err?.error?.errorDescription || err?.error?.message;
        alert(apiMessage || 'Failed to reject prescription');
      },
      complete: () => {
        this.submittingByPrescription[id] = false;
      }
    });
  }

}
