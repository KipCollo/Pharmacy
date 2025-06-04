package com.kipcollo.orders;

import com.kipcollo.customer.Users;
import com.kipcollo.payments.PaymentMethod;
import com.kipcollo.products.Product;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private int orderId;
    private String reference;
    private Users customers;
    private List<Product> products;
    private PaymentMethod paymentMethod;
    private BigDecimal totalAmount;
    private LocalDateTime localDateTime;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedDate;
}
