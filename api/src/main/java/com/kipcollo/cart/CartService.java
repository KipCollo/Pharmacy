package com.kipcollo.cart;

import com.kipcollo.products.Product;
import com.kipcollo.products.ProductRepository;
import com.kipcollo.user.UserService;
import com.kipcollo.user.Users;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.embedded.undertow.UndertowServletWebServer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Transactional
    public List<CartResponse> getCartByUser() {
        Users user = userService.getAuthenticatedUser();

        return cartRepository.findByUserCustomerIdAndOrderedFalse(user.getCustomerId())
                .stream()
                .map(cartMapper::fromCart)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartResponse addToCart(CartRequest request, Users user) {

        Cart cart = cartRepository
                .findByUserAndStatus(user, CartStatus.STARTED)
                .orElseGet(() -> cartRepository.save(cartMapper.toCart(user)));

        for (CartProduct p : request.getProduct()) {

            Product product = productRepository.findById(p.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartProduct cartProduct = cart
                    .getCartProducts()
                    .stream()
                    .filter(cp -> cp.getProduct().getId() == product.getId())
                    .findFirst()
                    .orElse(null);

            if (cartProduct == null) {
                CartProduct cp = new CartProduct();
                cp.setCart(cart);
                cp.setProduct(product);
                cp.setQuantity(p.getQuantity());
                cart.getCartProducts().add(cp);
            } else {
                cartProduct.setQuantity(cartProduct.getQuantity() + p.getQuantity());
            }
        }

        cart.setUpdateTime(LocalDateTime.now());
        return cartMapper.fromCart(cartRepository.save(cart));
    }

    public void removeFromCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart Not Found"));
        cart.setStatus(CartStatus.REMOVED);
        cart.setUpdateTime(LocalDateTime.now());
        cartRepository.save(cart);
        cartRepository.deleteById(cartId);
    }

    public void placeOrder() {
        Users user = userService.getAuthenticatedUser();

        List<Cart> carts = cartRepository.findByUserCustomerIdAndStatus(user.getCustomerId(), CartStatus.STARTED);
        for (Cart cart : carts) {
            cart.setStatus(CartStatus.CHECKED_OUT);
            cart.setUpdateTime(LocalDateTime.now());
        }
        cartRepository.saveAll(carts);
    }

    public List<CartResponse> getCartsByStatus(CartStatus status) {
        return cartRepository.findByStatus(status)
                .stream()
                .map(cartMapper::fromCart)
                .collect(Collectors.toList());
    }

    public List<CartResponse> getAllCarts() {
        return cartRepository.findAll().stream().map(cartMapper::fromCart).toList();
    }

    public CartResponse getCartById(int cartId) {
        return cartRepository.findById(cartId)
                .map(cartMapper::fromCart)
                .orElseThrow();
    }

    @Transactional
    public void removeProductFromCart(int cartId, int productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getCartProducts().removeIf(p -> p.getProduct().getId() == productId);
        cartRepository.save(cart);
    }
}
