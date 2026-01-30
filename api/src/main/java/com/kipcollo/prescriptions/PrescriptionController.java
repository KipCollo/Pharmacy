package com.kipcollo.prescriptions;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private PrescriptionService service;

    @GetMapping
    public ResponseEntity<List<PrescriptionResponse>> getAllPrescriptions(){
        return ResponseEntity.ok(service.getAllPrescriptions());
    }

    @PostMapping
    public ResponseEntity<?> uploadPrescription(@RequestParam String email,
                                                @RequestParam MultipartFile file){
        Prescriptions prescriptions = service.uploadPrescriptions(email,file);
        return ResponseEntity.ok("Prescription uploaded successfully.");
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePrescription(@PathVariable Integer id){
        Prescriptions prescriptions = service.approvePrescriptions(id);
        return ResponseEntity.ok("Prescription approved successfully.");
    }
}
