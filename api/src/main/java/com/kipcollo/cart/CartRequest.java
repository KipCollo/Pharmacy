package com.kipcollo.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    private int id;
    private int userId;
    private int productId;
    private int stockQuantity;
    private boolean ordered;
}
