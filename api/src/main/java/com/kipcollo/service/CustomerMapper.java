//package com.kipcollo.service;
//
//import com.kipcollo.dto.CustomerResponse;
//import org.springframework.stereotype.Service;
//
//import com.kipcollo.dto.CustomerRequest;
//import com.kipcollo.model.Customer;
//
//@Service
//public class CustomerMapper {
//
//   public Customer toCustomer(CustomerRequest request) {
//       return Customer.builder()
//               .customerId(request.getCustomerId())
//               .firstName(request.getFirstName())
//               .lastName(request.getLastName())
//               .age(request.getAge())
//               .phone(request.getPhone())
//               .email(request.getEmail())
//               .location(request.getLocation())
//               .build();
//   }
//
//    public CustomerResponse fromCustomer(Customer customer) {
//        return new CustomerResponse(
//                customer.getCustomerId(),
//                customer.getFirstName(),
//                customer.getLastName(),
//                customer.getAge(),
//                customer.getPhone(),
//                customer.getEmail(),
//                customer.getPassword(),
//                customer.getLocation()
//
//        );
//    }
//}
