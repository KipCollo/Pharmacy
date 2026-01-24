package com.kipcollo.cart;

import com.kipcollo.products.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    private int id;
    private int userId;
    private List<Product> product;
    private boolean ordered;
}
