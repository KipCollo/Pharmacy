package com.kipcollo.service;

import java.util.List;
import java.util.stream.Collectors;
import com.kipcollo.dto.CustomerRequest;
import com.kipcollo.dto.CustomerResponse;
import io.micrometer.common.util.StringUtils;
import org.springframework.stereotype.Service;

import com.kipcollo.model.Customer;
import com.kipcollo.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomerService {

   private final CustomerRepository repo;
   private final CustomerMapper mapper;

   public List<CustomerResponse> getAllCustomers() {

      return repo.findAll()
              .stream()
              .map(mapper::fromCustomer)
              .collect(Collectors.toList());
   }

    public String createCustomer(CustomerRequest request) {
      Customer customer = repo.save(mapper.toCustomer(request));
      return "Customer Created with ID:: " + customer.getCustomerId();
    }

   public CustomerResponse getCustomerById(Integer customerId) {
      return repo.findById(customerId)
              .map(mapper::fromCustomer)
              .orElseThrow(() -> new RuntimeException("Customer not found"));
   }

   public void updateCustomer(CustomerRequest request) {
       var customer = repo.findById(request.getCustomerId())
                       .orElseThrow(() -> new RuntimeException("Customer not found"));
       mergeCustomer(customer,request);
   }

   public void deleteCustomer(Integer customerId) {
      repo.deleteById(customerId);
   }

   private void mergeCustomer(Customer customer, CustomerRequest request) {

       if (StringUtils.isNotBlank(String.valueOf(customer.getCustomerId()))){
           customer.setCustomerId(request.getCustomerId());
       }
       if (StringUtils.isNotBlank(customer.getFirstName())){
           customer.setFirstName(request.getFirstName());
       }
       if (StringUtils.isNotBlank(customer.getLastName())){
           customer.setLastName(request.getLastName());
       }
       if (StringUtils.isNotBlank(String.valueOf(customer.getAge()))){
           customer.setAge(request.getAge());
       }
       if (StringUtils.isNotBlank(customer.getEmail())){
           customer.setEmail(request.getEmail());
       }
       if (StringUtils.isNotBlank(customer.getPhone())){
           customer.setPhone(request.getPhone());
       }
       if(StringUtils.isNotBlank(customer.getLocation())){
           customer.setLocation(request.getLocation());
       }
       if (StringUtils.isNotBlank(customer.getPassword())){
           customer.setPassword(request.getPassword());
       }
   }
}
