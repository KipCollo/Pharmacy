package com.kipcollo.products;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategory {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Integer id;
   private String name;
   private String description;
   private byte[] image;
   @OneToMany(mappedBy="category")
   private List<Product> products;

}
