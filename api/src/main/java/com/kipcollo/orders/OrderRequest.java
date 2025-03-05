package com.kipcollo.orders;

import com.kipcollo.dto.PurchaseRequest;
import com.kipcollo.payments.PaymentMethod;
import com.kipcollo.products.PurchaseProductRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private int orderId;
    @NotBlank(message = "Customer Should be present")
    @NotNull(message = "Customer should be present")
    private String reference;
    @NotNull(message="Payment method should be precise")
    private PaymentMethod paymentMethod;
    @NotNull(message = "Customer should be present")
    @NotBlank(message="Customer should be present")
    private int customerId;
    @Positive(message = "Amount should be positive")
    private BigDecimal totalAmount;
    @NotEmpty(message = "You should purchase at least one product")
    private List<PurchaseProductRequest> products;
}
