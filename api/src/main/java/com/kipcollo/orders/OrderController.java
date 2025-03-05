package com.kipcollo.orders;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Order APIs")
@RestController("/api/products")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Integer> createOrder(@RequestBody OrderRequest orderRequest){
        return ResponseEntity.ok(orderService.createOrder(orderRequest));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> findAll(){
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("{orderId")
    public ResponseEntity<OrderResponse> findById(@PathVariable int orderId){
        return ResponseEntity.ok(orderService.findBtId(orderId));
    }
}
