package com.kipcollo.controller;

import com.kipcollo.dto.MedicineRequest;
import com.kipcollo.dto.MedicineResponse;
import com.kipcollo.service.MedicineService;
import com.kipcollo.service.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Medicine")
@RequestMapping("/api/medicines")
public class MedicineController {

   private final MedicineService service;

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
   public ResponseEntity<String> createMedicine(@RequestPart MedicineRequest medicine,
                                                @RequestPart MultipartFile imageFile) {
       return ResponseEntity.ok(service.createMedicine(medicine,imageFile));
   }

   @DeleteMapping("/{medicineId}")
   public ResponseEntity<Void> deleteMedicine(@PathVariable Integer medicineId) {
       service.deleteMedicine(medicineId);
       return ResponseEntity.accepted().build();
   }
}
