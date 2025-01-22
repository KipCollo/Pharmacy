package com.kipcollo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kipcollo.model.Customer;
import com.kipcollo.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomerService {

   private final CustomerRepository repo;
   private final CustomerMapper mapper;

   public List getAllCustomers() {
      return repo.findAll();
   }

   // public String createCustomer(Customer customer) {
   //   repo.save(mapper.toCustomer(customer));
   //   return "Customer Created";
   // }
}
