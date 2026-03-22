import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from "@angular/router";
import { PrescriptionResponse } from "../services/models/prescription-response";
import { PrescriptionControllerService } from "../services/services/prescription-controller.service";
import { PrescriptionItem } from "../services/models/prescription-item";
import { CartStore } from "../cart/cart-modal/cart.service";

@Component({
    selector: 'app-prescription',
    standalone: true,
    imports: [],
    templateUrl: './prescription.component.html',
    styleUrl: './prescription.component.css'
})
export class PrescriptionComponent implements OnInit, OnDestroy {
    private prescriptionService = inject(PrescriptionControllerService);
    private cartStore = inject(CartStore);
    private router = inject(Router);

    readonly steps = ['Upload Prescription', 'Approval Status', 'Prescription Products'];
    currentStepIndex = 0;

    selectedFile: File | null = null;
    latestPrescription: PrescriptionResponse | null = null;
    selectedProducts: PrescriptionItem[] = [];

    isUploading = false;
    isLoadingStatus = false;
    successMessage = '';
    errorMessage = '';

    private statusPollerId: ReturnType<typeof setInterval> | null = null;

    ngOnInit(): void {
        this.refreshLatestPrescription(false);
    }

    ngOnDestroy(): void {
        this.stopStatusPolling();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedFile = input.files?.[0] ?? null;
        this.errorMessage = '';
        this.successMessage = '';
    }

    uploadPrescription(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Please select a prescription file first.';
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.isUploading = true;

        const formData = new FormData();
        formData.append('image', this.selectedFile);

        this.prescriptionService.uploadPrescription({ body: formData as any }).subscribe({
            next: () => {
                this.isUploading = false;
                this.successMessage = 'Prescription uploaded successfully. Waiting for admin approval.';
                this.currentStepIndex = 1;
                this.refreshLatestPrescription(true);
            },
            error: (err) => {
                this.isUploading = false;
                this.errorMessage = `Upload failed: ${err?.message || 'Unknown error'}`;
            }
        });
    }

    goToStep(index: number): void {
        if (index < 0 || index > 2) {
            return;
        }

        if (index === 2 && !this.canProceedToProducts()) {
            return;
        }

        this.currentStepIndex = index;
    }

    refreshLatestPrescription(pollAfterLoad: boolean): void {
        this.isLoadingStatus = true;
        this.prescriptionService.getUserPrescriptions().subscribe({
            next: (prescriptions) => {
                this.isLoadingStatus = false;

                const latest = [...prescriptions].sort((a, b) => {
                    const aTime = new Date(a.uploadedAt ?? 0).getTime();
                    const bTime = new Date(b.uploadedAt ?? 0).getTime();
                    return bTime - aTime;
                })[0] ?? null;

                this.latestPrescription = latest;

                if (latest?.status === 'APPROVED') {
                    this.selectedProducts = [...(latest.prescriptionItem ?? [])];
                    this.stopStatusPolling();
                } else if (pollAfterLoad || this.currentStepIndex === 1) {
                    this.startStatusPolling();
                }
            },
            error: () => {
                this.isLoadingStatus = false;
                this.errorMessage = 'Unable to load prescription status right now.';
            }
        });
    }

    startStatusPolling(): void {
        if (this.statusPollerId) {
            return;
        }
        this.statusPollerId = setInterval(() => {
            this.refreshLatestPrescription(false);
        }, 15000);
    }

    stopStatusPolling(): void {
        if (!this.statusPollerId) {
            return;
        }
        clearInterval(this.statusPollerId);
        this.statusPollerId = null;
    }

    canProceedToProducts(): boolean {
        return this.latestPrescription?.status === 'APPROVED' && this.selectedProducts.length > 0;
    }

    proceedToProducts(): void {
        if (!this.canProceedToProducts()) {
            return;
        }
        this.currentStepIndex = 2;
    }

    removeSelectedProduct(itemId?: number): void {
        this.selectedProducts = this.selectedProducts.filter(item => item.id !== itemId);
    }

    cancelPurchase(): void {
        this.selectedProducts = [...(this.latestPrescription?.prescriptionItem ?? [])];
        this.currentStepIndex = 1;
    }

    proceedToPurchase(): void {
        if (!this.selectedProducts.length) {
            this.errorMessage = 'Please keep at least one product to continue.';
            return;
        }

        for (const item of this.selectedProducts) {
            const productId = item.product?.id;
            if (!productId) {
                continue;
            }

            const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
            for (let i = 0; i < quantity; i++) {
                this.cartStore.addToCart(productId);
            }
        }

        this.successMessage = 'Selected products added to cart. Proceed to checkout.';
        this.router.navigate(['/cart']);
    }

    goHome(): void {
        this.router.navigate(['/home']);
    }

    goProducts(): void {
        this.router.navigate(['/products']);
    }
}
