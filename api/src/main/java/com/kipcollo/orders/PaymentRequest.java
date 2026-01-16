package com.kipcollo.orders;

import com.kipcollo.payments.PaymentMethod;
import com.kipcollo.user.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {

    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private int orderId;
    private String orderReference;
    private UserResponse customer;
}
