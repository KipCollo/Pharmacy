package com.kipcollo.orders;

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
}
