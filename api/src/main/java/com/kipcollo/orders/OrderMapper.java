package com.kipcollo.orders;

import com.kipcollo.cart.CartProductResponse;
import com.kipcollo.products.PurchaseProductRequest;
import org.springframework.stereotype.Service;

@Service
public class OrderMapper {

    public Orders toOrder(OrderRequest request){
        return Orders.builder()
                .customers(request.getCustomers())
                .reference(request.getReference())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(request.getTotalAmount())
                .build();
    }

    public OrderResponse fromOrder(Orders order){
        return new OrderResponse(
                order.getId(),
                order.getReference(),
                order.getCustomers(),
                order.getProducts(),
                order.getPaymentMethod(),
                order.getTotalAmount(),
                order.getLocalDateTime(),
                order.getCreatedAt(),
                order.getLastModifiedDate()
        );
    }
    public PurchaseProductRequest fromCart(CartProductResponse products){
        return PurchaseProductRequest
                .builder()
                .productId(products.getProductId())
                .quantity(products.getQuantity())
                .build();
    }
}
