package com.kipcollo.orderlines;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orderline")
@RequiredArgsConstructor
public class OrderLineController {

    private final OrderLineService service;

    @GetMapping("order/{orderId}")
    public ResponseEntity<List<OrderLineResponse>> findOrderById(@PathVariable int orderId) {
        return ResponseEntity.ok(service.findAllByOrderId(orderId));
    }
}
