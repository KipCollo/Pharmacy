package com.kipcollo.products;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper mapper;

    public List<ProductCategoryResponse> getProductCategory() {
        return productCategoryRepository.findAll().stream().map(mapper::fromProductCategory).collect(Collectors.toList());
    }

    public ProductCategoryResponse getMedicineById(Integer id) {
        return productCategoryRepository.findById(id).map(mapper::fromProductCategory).orElseThrow();
    }

    @Transactional
    public String createProductCategory(ProductCategoryRequest productCategoryRequest) {
        var productCategory = productCategoryRepository.save(mapper.toProductCategory(productCategoryRequest));
        return "Category Created with ID" + productCategory.getId();
    }
}
