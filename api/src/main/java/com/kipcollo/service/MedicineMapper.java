//package com.kipcollo.service;
//
//import com.kipcollo.dto.MedicineRequest;
//import com.kipcollo.dto.MedicineResponse;
//import com.kipcollo.model.Medicine;
//import org.springframework.stereotype.Service;
//
//@Service
//public class MedicineMapper {
//    public MedicineResponse fromMedicine(Medicine medicine) {
//        return new MedicineResponse(
//                medicine.getMedicineId(),
//                medicine.getName(),
//                medicine.getDescription(),
//                medicine.getType(),
//                medicine.getManufacturer(),
//                medicine.getExpiryDate(),
//                medicine.getStockQuantity(),
//                medicine.getPrice()
//        );
//    }
//
//    public Medicine toMedicine(MedicineRequest medicineRequest) {
//        return Medicine.builder()
//                .medicineId(medicineRequest.getMedicineId())
//                .name(medicineRequest.getName())
//                .description(medicineRequest.getDescription())
//                .type(medicineRequest.getType())
//                .manufacturer(medicineRequest.getManufacturer())
//                .expiryDate(medicineRequest.getExpiryDate())
//                .stockQuantity(medicineRequest.getStockQuantity())
//                .price(medicineRequest.getPrice())
//                .build();
//    }
//}
