package com.kipcollo.cart;

import org.springframework.stereotype.Service;

import com.kipcollo.user.UserRequest;
import com.kipcollo.user.Users;

@Service
public class CartMapper {

    public Cart toCart(CartRequest request) {
        return Cart.builder()
                .id(request.getId())
                .userId(request.getUserId())
                .product(request.getProduct())
                .ordered(request.isOrdered())
                .build();
    }

    public CartResponse fromCart(Cart cart) {
        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                cart.getProduct(),
                cart.isOrdered(),
                cart.getStatus()
        );
    }
}
