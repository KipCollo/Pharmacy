package com.kipcollo.orders;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderProcessingService {

    private final OrderRepository orderRepository;

    public Orders createPrescriptionOrder(int prescriptionId) {
        Orders order = new Orders();
        order.setPrescriptionId(prescriptionId);
        return orderRepository.save(order);
    }

    public Orders getOrderStatus(int id) {
        Optional<Orders> optionalOrders = orderRepository.findById(id);
        if (optionalOrders.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return optionalOrders.get();
    }
}
