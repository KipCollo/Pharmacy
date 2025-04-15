package com.kipcollo.products;

import org.springframework.stereotype.Service;

@Service
public class ProductMapper {
   public ProductResponse fromProduct(Product product) {
       return new ProductResponse(
               product.getId(),
               product.getName(),
               product.getDescription(),
               product.getType(),
               product.getImage(),
               product.getManufacturer(),
               product.getExpiryDate(),
               product.getStockQuantity(),
               product.getPrice()
       );
   }

   public Product toProduct(ProductRequest productRequest) {
       return Product.builder()
               .id(productRequest.getMedicineId())
               .name(productRequest.getName())
               .description(productRequest.getDescription())
               .type(productRequest.getType())
               .image(productRequest.getImage())
               .manufacturer(productRequest.getManufacturer())
               .expiryDate(productRequest.getExpiryDate())
               .stockQuantity(productRequest.getStockQuantity())
               .price(productRequest.getPrice())
               .build();
   }

   public PurchaseProductResponse toPurchaseProductResponse(Product product,int quantity) {
       return new PurchaseProductResponse(
               product.getId(),
               product.getName(),
               product.getImage(),
               product.getDescription(),
               product.getPrice(),
               quantity
       );
   }
}
