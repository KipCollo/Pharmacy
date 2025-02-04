//package com.kipcollo.controller;
//
//import com.kipcollo.dto.MedicineRequest;
//import com.kipcollo.dto.MedicineResponse;
//import com.kipcollo.service.MedicineService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/v1/medicines")
//public class MedicineController {
//
//    private final MedicineService service;
//
//    @GetMapping
//    public ResponseEntity<List<MedicineResponse>> getMedicines() {
//        return ResponseEntity.ok(service.getAllMedicine());
//    }
//
//    @GetMapping("/{medicineId}")
//    public ResponseEntity<MedicineResponse> getMedicineById(@PathVariable Integer medicineId) {
//        return ResponseEntity.ok(service.getMedicineById(medicineId));
//    }
//
//    @PostMapping
//    public ResponseEntity<String> createMedicine(@RequestBody MedicineRequest request) {
//        return ResponseEntity.ok(service.createMedicine(request));
//    }
//
//    @DeleteMapping("/{medicineId}")
//    public ResponseEntity<Void> deleteMedicine(@PathVariable Integer medicineId) {
//        service.deleteMedicine(medicineId);
//        return ResponseEntity.accepted().build();
//    }
//}
