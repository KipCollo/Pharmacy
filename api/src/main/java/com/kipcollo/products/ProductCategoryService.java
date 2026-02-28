package com.kipcollo.products;

import io.micrometer.common.util.StringUtils;
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

    @Transactional
    public void updateProductCategory(ProductCategoryRequest request) {
        var category = productCategoryRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        mergeMedicine(category,request);
    }

    private void mergeMedicine(ProductCategory category, ProductCategoryRequest request) {
        if (request.getName() != null && !request.getName().isBlank()) {
            category.setName(request.getName());
        }

        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            category.setDescription(request.getDescription());
        }

        if (request.getImage() != null) {
            category.setImage(request.getImage());
        }

    }
}
