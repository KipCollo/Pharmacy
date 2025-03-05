package com.kipcollo.orderlines;

import com.kipcollo.orders.Orders;
import org.springframework.stereotype.Service;

@Service
public class OrderLineMapper {

    public OrderLine toOrderLine(OrderLineRequest orderLineRequest){
        return OrderLine.builder()
                .orderLineId(orderLineRequest.getOrderId())
                .quantity(orderLineRequest.getQuantity())
                .orders(
                        Orders.builder()
                                .id(orderLineRequest.getOrderId())
                                .build()
                )
                .build();
    }

    public OrderLineResponse toOrderLineResponse(OrderLine orderLine){
        return new OrderLineResponse(orderLine.getOrderLineId(),orderLine.getQuantity());
    }
}
