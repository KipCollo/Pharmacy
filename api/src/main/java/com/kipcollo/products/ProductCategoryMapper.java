package com.kipcollo.products;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductCategoryMapper {

    public ProductCategoryResponse fromProductCategory(ProductCategory productCategory){

        List<ProductResponse> productResponses = productCategory.getProducts()
                .stream()
                .map(product -> ProductResponse.builder()
                        .productId(product.getId())
                        .name(product.getName())
                        .description(product.getDescription())
                        .type(product.getType())
                        .manufacturer(product.getManufacturer())
                        .expiryDate(product.getExpiryDate())
                        .stockQuantity(product.getStockQuantity())
                        .price(product.getPrice())
                        .category(ProductCategoryResponse.builder()
                                .id(product.getCategory().getId())
                                .name(product.getCategory().getName())
                                .build())
                        .build())
                .collect(Collectors.toList());

        return ProductCategoryResponse.builder()
                .id(productCategory.getId())
                .name(productCategory.getName())
                .description(productCategory.getDescription())
                .image(productCategory.getImage())
                .products(productResponses)
                .build();
    }

    public ProductCategory toProductCategory(ProductCategoryRequest productCategoryRequest) {
        return ProductCategory.builder()
                .id(productCategoryRequest.getId())
                .name(productCategoryRequest.getName())
                .description(productCategoryRequest.getDescription())
                .image(productCategoryRequest.getImage())
                .build();
    }
}
