package com.kipcollo.cart;

import com.kipcollo.products.Product;
import com.kipcollo.user.Users;
import jakarta.persistence.*;

import java.util.ArrayList;
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
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartProduct> cartProducts = new ArrayList<>();
    private boolean ordered;
    @Enumerated(EnumType.STRING)
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
