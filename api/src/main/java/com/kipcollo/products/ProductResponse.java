package com.kipcollo.products;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class ProductResponse {

    private int productId;
    private String name;
    private String description;
    private MedicineType type;
    private byte[] image;
    private String manufacturer;
    private LocalDate expiryDate;
    private int stockQuantity;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private BigDecimal discount;
    private boolean trending;
    private ProductCategoryResponse category;
    private boolean newArrival;

}
