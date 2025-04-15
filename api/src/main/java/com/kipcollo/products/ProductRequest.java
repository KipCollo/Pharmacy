package com.kipcollo.products;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

    private int medicineId;
    private String name;
    private byte[] image;
    private String description;
    private MedicineType type;
    private String manufacturer;
    private LocalDate expiryDate;
    private int stockQuantity;
    private BigDecimal price;
}
