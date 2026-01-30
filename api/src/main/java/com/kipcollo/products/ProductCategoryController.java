package com.kipcollo.products;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product-category")
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    @GetMapping
    public ResponseEntity<List<ProductCategoryResponse>> getProductCategory(){
        return ResponseEntity.ok(productCategoryService.getProductCategory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCategoryResponse> getProductCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(productCategoryService.getMedicineById(id));
    }

    @PostMapping
    public ResponseEntity<String> createProductCategory(@RequestPart("product") ProductCategoryRequest productCategoryRequest,
                                                 @RequestParam("image") MultipartFile image) throws IOException {
        // Convert image to Blob (byte array) before passing to service
        byte[] imageBytes = image.getBytes();
        productCategoryRequest.setImage(imageBytes);
        return ResponseEntity.ok(productCategoryService.createProductCategory(productCategoryRequest));
    }

}
