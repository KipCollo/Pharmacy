package com.kipcollo.orders;

import com.kipcollo.cart.Cart;
import com.kipcollo.cart.CartProductResponse;
import com.kipcollo.cart.CartRepository;
import com.kipcollo.cart.CartStatus;
import com.kipcollo.orderlines.OrderLineRequest;
import com.kipcollo.orderlines.OrderLineService;
import com.kipcollo.payments.PaymentRequest;
import com.kipcollo.payments.PaymentService;
import com.kipcollo.products.ProductService;
import com.kipcollo.products.PurchaseProductRequest;
import com.kipcollo.user.UserService;
import com.kipcollo.user.Users;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderLineService orderLineService;
    private final UserService userService;
    private final ProductService productService;
    private final CartRepository cartRepository;
    private final PaymentService paymentService;
;

    @Transactional
    public Integer createOrder(OrderRequest orderRequest) {
        //check the customer
//        Users user = userService.getAuthenticatedUser();
       var user = userService.getCustomerById(orderRequest.getCustomers().getCustomerId());
        if (user == null) throw new RuntimeException("Customer not found");

        List<Cart> carts = cartRepository
                .findByUserCustomerIdAndStatus(
                        user.getCustomerId(),
                        CartStatus.STARTED
                );

        if (carts.isEmpty()) {
            throw new RuntimeException("No active carts");
        }

        //purchase product
        var purchaseRequests = orderMapper.fromCart((CartProductResponse) carts);
        var purchasedProducts = productService.purchaseProduct(Collections.singletonList(purchaseRequests));

        //persist order
        var order = orderRepository.save(orderMapper.toOrder(orderRequest));

        for(PurchaseProductRequest purchaseRequest: orderRequest.getProducts()){
            orderLineService.saveOrderLine(
                    new OrderLineRequest(
                            0,
                            order.getId(),
                            purchaseRequest.getProductId(),
                            purchaseRequest.getQuantity()
                    )
            );
        }

        var paymentRequest = new PaymentRequest(
                orderRequest.getTotalAmount(),
                orderRequest.getPaymentMethod(),
                order.getId(),
                order.getReference(),
                user
        );
        paymentService.process(paymentRequest);

        for (Cart cart : carts) {
            cart.setStatus(CartStatus.CHECKED_OUT);
            cart.setUpdateTime(LocalDateTime.now());
        }

        cartRepository.saveAll(carts);



        return order.getId();
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::fromOrder)
                .collect(Collectors.toList());
    }

    public OrderResponse findById(Integer orderId) {

        return orderRepository.findById(orderId)
                .map(orderMapper::fromOrder)
                .orElseThrow(
                        () -> new EntityNotFoundException(String.format("No Order found with provided ID: %d", orderId))
                );
    }
}
