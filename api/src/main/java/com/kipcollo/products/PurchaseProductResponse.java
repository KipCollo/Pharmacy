package com.kipcollo.products;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseProductResponse {

    private int productId;
    private String name;
    private String description;
    private BigDecimal price;
    private double quantity;
}
