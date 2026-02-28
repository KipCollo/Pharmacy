package com.kipcollo.products;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "medicine")
public class Product {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;
   private String name;
   @Column(length = 1000)
   private String description;
   private MedicineType type;
   @Lob
   private byte[] image;
   @Column(nullable = false) 
   private String manufacturer;
   private LocalDate expiryDate;
   @Column(nullable = false)
   private int stockQuantity;
   @Column(nullable = false)
   private BigDecimal price;
   @ManyToOne
   @JoinColumn(name = "category")
   private ProductCategory category;
   @ManyToMany
   @JoinTable(
        name = "product_condition",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "condition_id")
   )
   private Set<HealthCondition> conditions;
   @Column(updatable = false,nullable = false)
   @CreatedDate
   private LocalDateTime createdDate;
   @LastModifiedDate
   @Column(insertable = false)
   private LocalDateTime lastModifiedDate;

   private Long viewCount;
   private Long soldCount;
   @Column(nullable = true)
   private boolean active;

}
