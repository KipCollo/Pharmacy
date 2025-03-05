package com.kipcollo.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private int orderId;
    private String reference;
    private int customerId;
    private BigDecimal totalAmount;
}
