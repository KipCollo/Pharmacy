package com.kipcollo.model;

import com.kipcollo.products.Product;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "suppliers")
public class Suppliers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supplierId;
    private String name;
    private String email;
    private String address;
    @OneToMany(mappedBy = "suppliers")
    private List<Product> products;
}
