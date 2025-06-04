package com.kipcollo.orders;

import com.kipcollo.customer.UserService;
import com.kipcollo.customer.Users;
import com.kipcollo.dto.PurchaseRequest;
import com.kipcollo.orderlines.OrderLineRequest;
import com.kipcollo.orderlines.OrderLineService;
import com.kipcollo.products.ProductService;
import com.kipcollo.products.PurchaseProductRequest;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    private final UserService userService;
    private final ProductService productService;
;

    @Transactional
    public Integer createOrder(OrderRequest orderRequest) {
        //check the customer
       var customer = userService.getCustomerById(orderRequest.getCustomers().getCustomerId());

        //purchase product
        var purchasedProducts = productService.purchaseProduct(orderRequest.getProducts());

        //persist order
        var order = orderRepository.save(orderMapper.toOrder(orderRequest));

        for(PurchaseProductRequest purchaseRequest: orderRequest.getProducts()){
            orderLineService.saveOrderLine(
                    new OrderLineRequest(
                            0,
                            order.getId(),
                            purchaseRequest.getProductId(),
                            purchaseRequest.getQuantity()
                    )
            );
        }

        var paymentRequest = new PaymentRequest(
                orderRequest.getTotalAmount(),
                orderRequest.getPaymentMethod(),
                order.getId(),
                order.getReference(),
                customer
        );



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
