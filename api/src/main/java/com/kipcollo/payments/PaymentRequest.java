package com.kipcollo.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import com.kipcollo.user.UserResponse;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {

    private int paymentId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private int orderId;
    private String orderReference;
    private UserResponse customer;
}
