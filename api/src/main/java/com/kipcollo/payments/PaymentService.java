package com.kipcollo.payments;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    public int createPayment(PaymentRequest request){
        var payment = paymentRepository.save(paymentMapper.toPayment(request));
        return payment.getPaymentId();
    }
}
