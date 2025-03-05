package com.kipcollo.products;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@Tag(name = "Medicine APIs")
@RequestMapping("/api/medicines")
public class MedicineController {

   private final ProductService service;

   @GetMapping
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
