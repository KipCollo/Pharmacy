package com.kipcollo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseRequest {

    @NotNull(message = "Product is mandatory")
    private int productId;
    @Positive(message = "Quantity should be an integer")
    @NotNull(message = "Quantity is mandatory")
    private double quantity;
}
