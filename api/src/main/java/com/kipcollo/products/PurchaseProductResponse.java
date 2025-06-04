package com.kipcollo.products;

import jakarta.persistence.Basic;
import jakarta.persistence.FetchType;
import jakarta.persistence.Lob;
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
    @Lob
    @Basic(fetch = FetchType.EAGER)
    private byte[] image;
    private String description;
    private BigDecimal price;
    private double quantity;
}
