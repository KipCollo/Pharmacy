package com.kipcollo.cart;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
public class Cart{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int userId;
    private int productId;
    private int stockQuantity;
    private boolean ordered;
    @Enumerated(EnumType.STRING)
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
