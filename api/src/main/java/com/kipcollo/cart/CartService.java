package com.kipcollo.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartMapper cartMapper;

    public List<CartResponse> getCartByUser() {
        int userId =3;
        return cartRepository.findByUserIdAndOrderedFalse(userId)
                .stream()
                .map(cartMapper::fromCart)
                .collect(Collectors.toList());
    }

    public CartResponse addToCart(CartRequest cartRequest) {
        Cart cart = cartMapper.toCart(cartRequest);
        cart.setStatus(CartStatus.STARTED);
        cart.setCreateTime(LocalDateTime.now());
        cart.setUpdateTime(LocalDateTime.now());
        Cart savedCart = cartRepository.save(cart);
        return cartMapper.fromCart(savedCart);
    }

    public void removeFromCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart Not Found"));
        cart.setStatus(CartStatus.REMOVED);
        cart.setUpdateTime(LocalDateTime.now());
        cartRepository.save(cart);
        cartRepository.deleteById(cartId);
    }

    public void placeOrder(int userId) {
        List<Cart> carts = cartRepository.findByUserIdAndStatus(userId, CartStatus.STARTED);
        for (Cart cart : carts) {
            cart.setStatus(CartStatus.CHECKED_OUT);
            cart.setUpdateTime(LocalDateTime.now());
        }
        cartRepository.saveAll(carts);
        cartRepository.saveAll(carts);
    }

    public List<CartResponse> getCartsByStatus(CartStatus status) {
        return cartRepository.findByStatus(status)
                .stream()
                .map(cartMapper::fromCart)
                .collect(Collectors.toList());
    }
}
