package com.kipcollo.payments;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Payment {

    @Id
    @GeneratedValue
    private int paymentId;
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    private int orderId;
    @CreatedDate
    @Column(updatable=false, nullable=false)
    private LocalDateTime createDate;
    @LastModifiedDate
    @Column(insertable=false)
    private LocalDateTime lastModifiedDate;

}
