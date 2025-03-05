package com.kipcollo.orders;

import com.kipcollo.customer.Customer;
import com.kipcollo.orderlines.OrderLine;
import com.kipcollo.payments.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String reference;
    private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    private int customerId;
    private LocalDateTime localDateTime;
    @OneToMany(mappedBy = "orders")
    private List<OrderLine> orderLines;
    @Version
    private long version;
    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime createdAt;
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;
}
