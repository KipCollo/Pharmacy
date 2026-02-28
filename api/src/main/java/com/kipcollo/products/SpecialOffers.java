package com.kipcollo.products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity

@Getter
@Setter
@NoArgsConstructor
public class SpecialOffers {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    @OneToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private BigDecimal discountPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
}
