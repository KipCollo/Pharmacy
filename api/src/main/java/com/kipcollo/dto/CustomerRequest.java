package com.kipcollo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerRequest {

   private int customerId;
   private String firstName;
   private String lastName;
   private int age;
   private String phone;
   private String email;
   private String location;
}
