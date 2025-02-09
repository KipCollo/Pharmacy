package com.kipcollo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="Medicine")
public class Medicine {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int medicineId;
   private String name;
   private String description;
   private String imageName;
   private String imageType;
   @Lob
   private byte[] imageDate;
   private MedicineType type;
   @Column(nullable = false)
   private String manufacturer;
   private LocalDate expiryDate;
   @Column(nullable = false)
   private int stockQuantity;
   @Column(nullable = false)
   private double price;
   @ManyToOne
   @JoinColumn(name = "supplierId")
   private Suppliers suppliers;
   @Column(updatable = false,nullable = false)
   @CreatedDate
   private LocalDateTime createdDate;
   @LastModifiedDate
   @Column(insertable = false)
   private LocalDateTime lastModifiedDate;

}
