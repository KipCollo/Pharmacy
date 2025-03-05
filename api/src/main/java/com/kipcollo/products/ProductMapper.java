package com.kipcollo.products;

import org.springframework.stereotype.Service;

@Service
public class MedicineMapper {
   public MedicineResponse fromMedicine(Product product) {
       return new MedicineResponse(
               product.getMedicineId(),
               product.getName(),
               product.getDescription(),
               product.getType(),
               product.getManufacturer(),
               product.getExpiryDate(),
               product.getStockQuantity(),
               product.getPrice()
       );
   }

   public Product toMedicine(MedicineRequest medicineRequest) {
       return Product.builder()
               .medicineId(medicineRequest.getMedicineId())
               .name(medicineRequest.getName())
               .description(medicineRequest.getDescription())
               .type(medicineRequest.getType())
               .manufacturer(medicineRequest.getManufacturer())
               .expiryDate(medicineRequest.getExpiryDate())
               .stockQuantity(medicineRequest.getStockQuantity())
               .price(medicineRequest.getPrice())
               .build();
   }
}
