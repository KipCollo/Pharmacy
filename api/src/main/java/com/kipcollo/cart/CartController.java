package com.kipcollo.cart;

import com.kipcollo.user.UserService;
import com.kipcollo.user.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<CartResponse>> getUserCart() {
        return ResponseEntity.ok(cartService.getCartByUser());
    }

    @GetMapping("/all")
    public ResponseEntity<List<CartResponse>> getAllCarts(){
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CartResponse>> getCartsByStatus(@PathVariable CartStatus status) {
        return ResponseEntity.ok(cartService.getCartsByStatus(status));
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<CartResponse> getCartDetails(@PathVariable int cartId) {
        return ResponseEntity.ok(cartService.getCartById(cartId));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addCart(@RequestBody CartRequest cartRequest) {
        Users user = userService.getAuthenticatedUser();
        return ResponseEntity.ok(cartService.addToCart(cartRequest, user));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable int cartId) {
        cartService.removeFromCart(cartId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cartId}/product/{productId}")
    public ResponseEntity<Void> removeProductFromCart(
            @PathVariable int cartId,
            @PathVariable int productId) {
        cartService.removeProductFromCart(cartId, productId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout/")
    public ResponseEntity<Void> placeOrder() {
        cartService.placeOrder();
        return ResponseEntity.ok().build();
    }
}
