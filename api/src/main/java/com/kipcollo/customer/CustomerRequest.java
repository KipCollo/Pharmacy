package com.kipcollo.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequest {

   private int customerId;
   @NotNull(message="First Name is required")
   private String firstName;
   @NotNull(message="Last Name is required")
   private String lastName;
   private LocalDate dateOfBirth;
   private String phone;
   @NotNull(message = "Email is required")
   @Email(message = "Invalid Email")
   private String email;
   @NotNull(message = "Password is required")
   private String password;
   private String location;
}
