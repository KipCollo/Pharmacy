package com.kipcollo.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kipcollo.dto.CustomerRequest;
import com.kipcollo.dto.CustomerResponse;
import com.kipcollo.service.CustomerService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor

public class CustomerController {

   private final CustomerService service;

   @GetMapping
   public ResponseEntity<List<CustomerResponse>> getAllCustomers(){
      return ResponseEntity.ok(service.getAllCustomers());
   }

   @GetMapping("/{customerId}")
   public ResponseEntity<CustomerResponse> getCustomer(@PathVariable("customerId") Integer customerId){
       return ResponseEntity.ok(service.getCustomerById(customerId));
   }

    @PostMapping
    public ResponseEntity<String> addCustomer(@RequestBody @Valid CustomerRequest customer) {
       return ResponseEntity.ok(service.createCustomer(customer));
    }

    @PutMapping
    public ResponseEntity<Void> updateCustomer(@RequestBody @Valid CustomerRequest customer) {
       service.updateCustomer(customer);
       return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("customerId") Integer customerId) {
       service.deleteCustomer(customerId);
       return ResponseEntity.ok().build();
    }


}
