package com.kipcollo.customer;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api/customers")
@RequiredArgsConstructor
@Tag(name = "Customers APIs")
public class UsersController {

   private final UserService service;

   @GetMapping
   public ResponseEntity<List<UserResponse>> getAllCustomers(){
      return ResponseEntity.ok(service.getAllCustomers());
   }

   @GetMapping("/{customerId}")
   public ResponseEntity<UserResponse> getCustomer(@PathVariable("customerId") Integer customerId){
       return ResponseEntity.ok(service.getCustomerById(customerId));
   }

   @GetMapping("exists/{customerId}")
   public ResponseEntity<Boolean> existsById(@PathVariable int customerId){
       return ResponseEntity.ok(service.existsById(customerId));
   }

    @PostMapping
    public ResponseEntity<String> addCustomer(@RequestBody @Valid UserRequest customer) {
       return ResponseEntity.ok(service.createCustomer(customer));
    }

    @PutMapping
    public ResponseEntity<Void> updateCustomer(@RequestBody @Valid UserRequest customer) {
       service.updateCustomer(customer);
       return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("customerId") Integer customerId) {
       service.deleteCustomer(customerId);
       return ResponseEntity.ok().build();
    }


}
