package com.kipcollo.cart;

import com.kipcollo.products.Product;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartProductResponse {
    private int productId;
    private int quantity;
    private String name;
    private byte[] image;
    private BigDecimal price;
    private int stockQuantity;
}
