package com.kipcollo.products;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseProductRequest {

    @NotNull(message="Product id is required")
    private int productId;

    @NotNull(message="Quantity is required")
    private int quantity;
}
