package com.kipcollo.cart;

import com.kipcollo.products.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    private int id;
    private int userId;
    private Product product;
    private boolean ordered;
}
