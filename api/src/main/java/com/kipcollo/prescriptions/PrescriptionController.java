package com.kipcollo.prescriptions;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<PrescriptionResponse>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/user")
    public ResponseEntity<List<PrescriptionResponse>> getUserPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getUserPrescriptions());
    }

    @PostMapping
    public ResponseEntity<Void> uploadPrescription(@RequestParam("image") MultipartFile image) throws IOException {
        prescriptionService.uploadPrescriptions(image);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePrescription(
            @PathVariable Integer id,
            @RequestBody(required = false) List<PrescriptionItemRequest> items) {
        prescriptionService.reviewPrescription(id, true, items);
        return ResponseEntity.ok("Prescription approved successfully.");
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewPrescription(
            @PathVariable Integer id,
            @RequestParam boolean approved,
            @RequestBody(required = false) List<PrescriptionItemRequest> items) {
        prescriptionService.reviewPrescription(id, approved, items);
        String message = approved
                ? "Prescription approved successfully."
                : "Prescription rejected successfully.";
        return ResponseEntity.ok(message);
    }

    @GetMapping("/user/latest-approved")
    public ResponseEntity<PrescriptionResponse> getLatestApprovedPrescription() {
        return ResponseEntity.ok(prescriptionService.getLatestApprovedPrescription());
    }

}
