package com.kipcollo.cart;

import com.kipcollo.customer.UserRequest;
import com.kipcollo.customer.Users;
import org.springframework.stereotype.Service;

@Service
public class CartMapper {

    public Cart toCart(CartRequest request) {
        return Cart.builder()
                .id(request.getId())
                .userId(request.getUserId())
                .stockQuantity(request.getStockQuantity())
                .ordered(request.isOrdered())
                .build();
    }

    public CartResponse fromCart(Cart cart) {
        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                cart.getProductId(),
                cart.getStockQuantity(),
                cart.isOrdered()
        );
    }
}
