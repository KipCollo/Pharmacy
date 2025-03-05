package com.kipcollo.payments;

import com.kipcollo.customer.CustomerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {

    private int paymentId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private int orderId;
    private String orderReference;
    private CustomerResponse customer;
}
