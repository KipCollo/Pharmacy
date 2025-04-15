package com.kipcollo.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/add/{userId}")
    public ResponseEntity<List<CartResponse>> getUserCart(@PathVariable int userId) {
        return ResponseEntity.ok(cartService.getCartByUser(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CartResponse>> getCartsByStatus(@PathVariable CartStatus status) {
        return ResponseEntity.ok(cartService.getCartsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addCart(@RequestBody CartRequest cartRequest) {
        return ResponseEntity.ok(cartService.addToCart(cartRequest));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable int cartId) {
        cartService.removeFromCart(cartId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<Void> placeOrder(@PathVariable int userId) {
        cartService.placeOrder(userId);
        return ResponseEntity.ok().build();
    }
}
