package com.kipcollo.orders;

import org.springframework.stereotype.Service;

@Service
public class OrderMapper {

    public Orders toOrder(OrderRequest request){
        return Orders.builder()
                .id(request.getOrderId())
                .customerId(request.getCustomerId())
                .reference(request.getReference())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(request.getTotalAmount())
                .build();
    }

    public OrderResponse fromOrder(Orders order){
        return new OrderResponse(
                order.getId(),
                order.getReference(),
                order.getCustomerId(),
                order.getPaymentMethod(),
                order.getTotalAmount()
        );
    }
}
