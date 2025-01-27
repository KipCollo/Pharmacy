package com.kipcollo.dto;

import com.kipcollo.model.MedicineType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineRequest {

    private int medicineId;
    private String name;
    private String description;
    private MedicineType type;
    private String manufacturer;
    private LocalDate expiryDate;
    private int stockQuantity;
    private double price;
}
