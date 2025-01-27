package com.kipcollo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {

    private int customerId;
    private String firstName;
    private String lastName;
    private int age;
    private String phone;
    private String email;
    private String password;
    private String location;
}
