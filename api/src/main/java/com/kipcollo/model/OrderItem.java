package com.kipcollo.model;

import com.kipcollo.orders.Orders;
import com.kipcollo.products.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "order-item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private Orders orders;
    @ManyToOne
    @JoinColumn
    private Product product;
    private Integer quantity;
    private Double price;

}
