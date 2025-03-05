package com.kipcollo.orderlines;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderLineRequest {

    private int orderLineId;
    private int orderId;
    private int productId;
    private int quantity;
}
