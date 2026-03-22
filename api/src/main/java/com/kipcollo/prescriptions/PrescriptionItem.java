package com.kipcollo.prescriptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kipcollo.products.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "prescription-item")
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JsonIgnore
    private Prescriptions prescriptions;
    @ManyToOne
    private Product product;
    private Integer quantity;
}
