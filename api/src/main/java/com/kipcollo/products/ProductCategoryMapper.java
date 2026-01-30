package com.kipcollo.products;

import org.springframework.stereotype.Service;

@Service
public class ProductCategoryMapper {

    public ProductCategoryResponse fromProductCategory(ProductCategory productCategory){
        return new ProductCategoryResponse(
                productCategory.getId(),
                productCategory.getName(),
                productCategory.getDescription(),
                productCategory.getImage(),
                productCategory.getProducts()
        );
    }

    public ProductCategory toProductCategory(ProductCategoryRequest productCategoryRequest) {
        return ProductCategory.builder()
                .name(productCategoryRequest.getName())
                .description(productCategoryRequest.getDescription())
                .image(productCategoryRequest.getImage())
                .build();
    }
}
