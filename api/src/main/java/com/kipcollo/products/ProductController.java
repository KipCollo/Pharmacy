package com.kipcollo.products;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Medicine APIs")
@RequestMapping("/api/products")
public class ProductController {

   private final ProductService service;

   @GetMapping
   public ResponseEntity<PageResponse<ProductResponse>> getAllMedicines(@RequestParam(name = "page",defaultValue = "0",required = false) int page,
                                                                         @RequestParam(name = "size", defaultValue = "10",required = false) int size) {
       return ResponseEntity.ok(service.getAllMedicine(page,size));
   }

   @GetMapping("/{id}")
   public ResponseEntity<ProductResponse> getMedicineById(@PathVariable Integer id) {
       return ResponseEntity.ok(service.getMedicineById(id));
   }

    @PostMapping
   // @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> createMedicine(@RequestPart("product") ProductRequest medicine,
                                                 @RequestParam("image") MultipartFile image) throws IOException {
        // Convert image to Blob (byte array) before passing to service
        byte[] imageBytes = image.getBytes();
        medicine.setImage(imageBytes);  // Assuming ProductRequest has a setImage method
        return ResponseEntity.ok(service.createMedicine(medicine));
    }

    @PostMapping("/purchase")
   public ResponseEntity<List<PurchaseProductResponse>> purchaseProducts(@RequestBody List<PurchaseProductRequest> purchase){
       return ResponseEntity.ok(service.purchaseProduct(purchase));
   }

   @DeleteMapping("/{id}")
//   @PreAuthorize("hasRole('ROLE_ADMIN')")
   public ResponseEntity<Void> deleteMedicine(@PathVariable Integer id) {
       service.deleteMedicine(id);
       return ResponseEntity.accepted().build();
   }

    @PutMapping
   // @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> updateMedicine(@RequestBody @Valid ProductRequest medicine,
                                               @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        if (image != null) {
            byte[] imageBytes = image.getBytes();
            medicine.setImage(imageBytes);  // Assuming ProductRequest has a setImage method
        }
        service.updateMedicine(medicine);
        return ResponseEntity.ok().build();
    }
}
