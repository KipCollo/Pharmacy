package com.kipcollo.service;

import org.springframework.stereotype.Service;

import com.kipcollo.dto.CustomerRequest;
import com.kipcollo.model.Customer;

@Service
public class CustomerMapper {

   public Customer toCustomer(CustomerRequest request) {
     return Customer.builder()
      .customerId(request.getCustomerId())
      .age(request.getAge())
      .email(request.getEmail())
      .firstName(request.getFirstName())
      .lastName(request.getLastName())
      .phone(request.getPhone())
      .location(request.getLocation())
      .build();
   }

}
