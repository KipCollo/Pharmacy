package com.kipcollo.payments;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    public void process(PaymentRequest request){
        paymentRepository.save(Objects.requireNonNull(paymentMapper.toPayment(request)));
    }
}
