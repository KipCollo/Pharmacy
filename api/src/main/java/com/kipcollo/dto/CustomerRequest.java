package com.kipcollo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequest {

   private int customerId;
   @NotNull(message="First Name is required")
   private String firstName;
   @NotNull(message="Last Name is required")
   private String lastName;
   private int age;
   private String phone;
   @NotNull(message = "Email is required")
   @Email(message = "Invalid Email")
   private String email;
   @NotNull(message = "Password is required")
   private String password;
   private String location;
}
