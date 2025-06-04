package com.kipcollo.cart;

import com.kipcollo.products.Product;
import jakarta.persistence.*;
import lombok.*;

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
    @ManyToOne(cascade = CascadeType.ALL)
    private Product product;
    private boolean ordered;
    @Enumerated(EnumType.STRING)
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
