package com.kipcollo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {

    @NotNull(message = "Email is required")
    @Email(message = "Invalid Email")
    private String email;
    @NotNull(message = "Password is required")
    @Size(min = 8,message = "Password should be 8 characters long")
    private String password;
}
