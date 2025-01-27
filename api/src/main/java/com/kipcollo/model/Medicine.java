package com.kipcollo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name="Medicine")
public class Medicine {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int medicineId;
   private String name;
   private String description;
   private MedicineType type;
   @Column(nullable = false)
   private String manufacturer;
   private LocalDate expiryDate;
   @Column(nullable = false)
   private int stockQuantity;
   @Column(nullable = false)
   private double price;

}
