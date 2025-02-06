package com.kipcollo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegistrationRequest {

    @NotNull(message="First Name is required")
    @NotBlank(message="First Name is required")
    private String firstName;
    @NotNull(message="Last Name is required")
    @NotBlank(message="Last Name is required")
    private String lastName;
    @NotNull(message = "Email is required")
    @NotBlank(message="Email is required")
    @Email(message = "Invalid Email")
    private String email;
    @NotNull(message = "Password is required")
    @Size(min = 8,message = "Password should be 8 characters long")
    private String password;
}
