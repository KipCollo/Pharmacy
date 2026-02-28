package com.kipcollo.products;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProductMapper {
   public ProductResponse fromProduct(Product product) {
       return ProductResponse.builder()
               .productId(product.getId())
               .name(product.getName())
               .description(product.getDescription())
               .type(product.getType())
               .image(product.getImage())
               .manufacturer(product.getManufacturer())
               .expiryDate(product.getExpiryDate())
               .stockQuantity(product.getStockQuantity())
               .price(product.getPrice())
               .build();
   }

   public Product toProduct(ProductRequest productRequest) {
       return Product.builder()
               .name(productRequest.getName())
               .description(productRequest.getDescription())
               .type(productRequest.getType())
               .image(productRequest.getImage())
               .manufacturer(productRequest.getManufacturer())
               .expiryDate(productRequest.getExpiryDate())
               .stockQuantity(productRequest.getStockQuantity())
               .price(productRequest.getPrice())
               .active(true)
               .soldCount(0L)
               .viewCount(0L)
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

    public ProductResponse fromProductWithDiscount(Product product, BigDecimal discountPercentage) {

        BigDecimal discountedPrice = product.getPrice()
                .subtract(product.getPrice()
                        .multiply(discountPercentage)
                        .divide(BigDecimal.valueOf(100)));

        return ProductResponse.builder()
                .name(product.getName())
                .description(product.getDescription())
                .type(product.getType())
                .image(product.getImage())
                .manufacturer(product.getManufacturer())
                .expiryDate(product.getExpiryDate())
                .stockQuantity(product.getStockQuantity())
                .price(discountedPrice)
                .originalPrice(product.getPrice())
                .discount(discountPercentage)
                .build();
    }

    public void updateProduct(Product product, ProductRequest request) {

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setType(request.getType());
        product.setManufacturer(request.getManufacturer());
        product.setExpiryDate(request.getExpiryDate());
        product.setStockQuantity(request.getStockQuantity());
        product.setPrice(request.getPrice());

        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }
    }
}
