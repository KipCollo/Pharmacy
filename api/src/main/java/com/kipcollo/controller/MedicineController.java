package com.kipcollo.controller;

import com.kipcollo.dto.CustomerRequest;
import com.kipcollo.dto.MedicineRequest;
import com.kipcollo.dto.MedicineResponse;
import com.kipcollo.service.MedicineService;
import com.kipcollo.service.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Medicine")
@RequestMapping("/api/medicines")
public class MedicineController {

   private final MedicineService service;

   @GetMapping("/all")
   public ResponseEntity<PageResponse<MedicineResponse>> getAllMedicines(@RequestParam(name = "page",defaultValue = "0",required = false) int page,
                                                                         @RequestParam(name = "size", defaultValue = "10",required = false) int size) {
       return ResponseEntity.ok(service.getAllMedicine(page,size));
   }

   @GetMapping("/{medicineId}")
   public ResponseEntity<MedicineResponse> getMedicineById(@PathVariable Integer medicineId) {
       return ResponseEntity.ok(service.getMedicineById(medicineId));
   }

   @PostMapping
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<String> createMedicine(@RequestPart MedicineRequest medicine,
                                                @RequestPart MultipartFile imageFile) {
       return ResponseEntity.ok(service.createMedicine(medicine,imageFile));
   }

   @DeleteMapping("/{medicineId}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<Void> deleteMedicine(@PathVariable Integer medicineId) {
       service.deleteMedicine(medicineId);
       return ResponseEntity.accepted().build();
   }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateCustomer(@RequestBody @Valid MedicineRequest medicine) {
        service.updateMedicine(medicine);
        return ResponseEntity.ok().build();
    }
}
