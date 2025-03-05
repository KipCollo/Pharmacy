package com.kipcollo.orders;

import org.springframework.stereotype.Service;

@Service
public class OrderMapper {

    public Orders toOrder(OrderRequest request){
        return Orders.builder()
                .orderId(request.getOrderId())
                .customerId(request.getCustomerId())
                .reference(request.getReference())
                .totalAmount(request.getTotalAmount())
                .build();
    }

    public OrderResponse fromOrder(Orders order){
        return new OrderResponse(
                order.getOrderId(),
                order.getReference(),
                order.getCustomerId(),
                order.getTotalAmount()
        );
    }
}
