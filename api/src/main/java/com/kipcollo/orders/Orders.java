package com.kipcollo.orders;

import com.kipcollo.customer.Customer;
import com.kipcollo.orderlines.OrderLine;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;
    private String reference;
    private BigDecimal totalAmount;
    @ManyToOne
    private Customer customerId;
    private LocalDateTime localDateTime;
    @OneToMany(mappedBy = "order")
    private List<OrderLine> orderLines;
    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime createdAt;
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;
}
