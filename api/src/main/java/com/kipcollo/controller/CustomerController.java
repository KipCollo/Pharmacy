package com.kipcollo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kipcollo.dto.CustomerRequest;
import com.kipcollo.dto.CustomerResponse;
import com.kipcollo.service.CustomerService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
public class CustomerController {

   private final CustomerService service;

   @GetMapping
   public ResponseEntity<List<CustomerResponse>> getAllCustomers(){
      return ResponseEntity.ok(service.getAllCustomers());
   }

   // @PostMapping
   // public ResponseEntity<String> addCustomer(@RequestBody CustomerRequest customer) {
   //    return ResponseEntity.created(service.createCustomer(customer));
   // }
   
}
