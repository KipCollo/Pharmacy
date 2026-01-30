package com.kipcollo.user;

import com.kipcollo.auth.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private int customerId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String email;
    private String password;
    private String location;
    private List<Roles> roles;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}
