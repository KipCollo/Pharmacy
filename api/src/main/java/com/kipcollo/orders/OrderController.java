package com.kipcollo.orders;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Order APIs")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderProcessingService processingService;

    @PostMapping
    public ResponseEntity<Integer> createOrder(@RequestBody OrderRequest orderRequest){
        return ResponseEntity.ok(orderService.createOrder(orderRequest));
    }

    //create order from approved prescriptions
    @PostMapping("/create")
    public ResponseEntity<?> createPrescriptionOrder(@RequestParam int prescriptionId){
        Orders orders = processingService.createPrescriptionOrder(prescriptionId);
        return ResponseEntity.ok("Order created successfully");
    }

    //Track order by returning orderLines and their statuses
    @GetMapping("{id}/status")
    public ResponseEntity<?> getOrderStatus(@PathVariable int id){
        Orders orders = processingService.getOrderStatus(id);

        //Return Detailed order lines statuses for tracking
        return ResponseEntity.ok(orders.getOrderLines());
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> findAll(){
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("{orderId}")
    public ResponseEntity<OrderResponse> findById(@PathVariable int orderId){
        return ResponseEntity.ok(orderService.findBtId(orderId));
    }
}
