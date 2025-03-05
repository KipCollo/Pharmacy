package com.kipcollo.products;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
   //@PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<String> createMedicine(@RequestBody ProductRequest medicine ){
       return ResponseEntity.ok(service.createMedicine(medicine));
   }

   @PostMapping("/purchase")
   public ResponseEntity<List<PurchaseProductResponse>> purchaseProducts(@RequestBody List<PurchaseProductRequest> purchase){
       return ResponseEntity.ok(service.purchaseProduct(purchase));
   }

   @DeleteMapping("/{id}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<Void> deleteMedicine(@PathVariable Integer id) {
       service.deleteMedicine(id);
       return ResponseEntity.accepted().build();
   }

   @PutMapping
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<Void> updateCustomer(@RequestBody @Valid ProductRequest medicine) {
       service.updateMedicine(medicine);
       return ResponseEntity.ok().build();
   }
}
