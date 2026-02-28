package com.kipcollo.cart;

import com.kipcollo.products.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {

    private int id;
    private Integer userId;
    private List<CartProductResponse> product;
    private boolean ordered;
    private CartStatus status;
}
