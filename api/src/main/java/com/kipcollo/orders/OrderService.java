package com.kipcollo.orders;

import com.kipcollo.customer.Customer;
import com.kipcollo.customer.CustomerMapper;
import com.kipcollo.customer.CustomerService;
import com.kipcollo.email.EmailService;
import com.kipcollo.orderlines.OrderLineService;
import com.kipcollo.products.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderLineService orderLineService;
    private final CustomerService customerService;
    private final ProductService productService;
;

    public Integer createOrder(OrderRequest orderRequest) {
        //check the customer
        var customer = customerService.getCustomerById(orderRequest.getCustomerId());

        //purchase product
        var purchasedProducts = productService.purchaseProduct(orderRequest.getProducts());

        //persist order
        var order = orderRepository.save(orderMapper.toOrder(orderRequest));

        var paymentRequest = new PaymentRequest(
                orderRequest.getTotalAmount(),
                orderRequest.getPaymentMethod(),
                order.getId(),
                order.getReference(),
                customer
        );
        //send confirmation to customer


        return order.getId();
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::fromOrder)
                .collect(Collectors.toList());
    }

    public OrderResponse findBtId(Integer orderId) {

        return orderRepository.findById(orderId)
                .map(orderMapper::fromOrder)
                .orElseThrow(
                        () -> new EntityNotFoundException(String.format("No Order found with provided ID: %d", orderId))
                );
    }
}
