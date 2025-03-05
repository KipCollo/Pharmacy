package com.kipcollo.customer;

import org.springframework.stereotype.Service;

@Service
public class CustomerMapper {

   public Customer toCustomer(CustomerRequest request) {
       return Customer.builder()
               .customerId(request.getCustomerId())
               .firstName(request.getFirstName())
               .lastName(request.getLastName())
               .dateOfBirthDate(request.getDateOfBirth())
               .phone(request.getPhone())
               .email(request.getEmail())
               .location(request.getLocation())
               .build();
   }

    public CustomerResponse fromCustomer(Customer customer) {
        return new CustomerResponse(
                customer.getCustomerId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getDateOfBirthDate(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getPassword(),
                customer.getLocation()

        );
    }
}
