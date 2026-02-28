package com.kipcollo.cart;

import com.kipcollo.products.Product;
import com.kipcollo.products.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.kipcollo.user.UserRequest;
import com.kipcollo.user.Users;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartMapper {

    public CartResponse fromCart(Cart cart) {
        List<CartProductResponse> products = cart.getCartProducts().stream()
                .map(cp -> CartProductResponse.builder()
                        .productId(cp.getProduct().getId())
                        .name(cp.getProduct().getName())
                        .image(cp.getProduct().getImage())
                        .quantity(cp.getQuantity())
                        .price(cp.getProduct().getPrice())
                        .stockQuantity(cp.getProduct().getStockQuantity())
                        .build())
                .toList();

        return new CartResponse(
                cart.getId(),
                cart.getUser().getCustomerId(),
                products,
                cart.isOrdered(),
                cart.getStatus()
        );
    }

    public Cart toCart(Users user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setOrdered(false);
        cart.setStatus(CartStatus.STARTED);
        cart.setCreateTime(LocalDateTime.now());
        cart.setUpdateTime(LocalDateTime.now());
        return cart;
    }


}
