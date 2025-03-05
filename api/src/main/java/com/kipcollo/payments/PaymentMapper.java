package com.kipcollo.payments;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class PaymentMapper {

    public Payment toPayment(PaymentRequest request){
        return Payment.builder()
                .paymentId(request.getPaymentId())
                .paymentMethod(request.getPaymentMethod())
                .amount(request.getAmount())
                .orderId(request.getOrderId())
                .build();
    }
}
