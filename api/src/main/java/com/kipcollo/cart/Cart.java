package com.kipcollo.cart;

import com.kipcollo.products.Product;
import jakarta.persistence.*;
import java.util.List;
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
    private Integer id;
    private int userId;
    @OneToMany
    private List<Product> product;
    private boolean ordered;
    @Enumerated(EnumType.STRING)
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
