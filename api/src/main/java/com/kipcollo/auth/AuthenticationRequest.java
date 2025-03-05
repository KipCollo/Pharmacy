package com.kipcollo.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {

    @Email(message = "Invalid Email")
    @NotNull(message="Username is required")
    private String email;
    @NotNull(message="Password is required")
    @Size(min = 8,message = "Password should be 8 characters long")
    private String password;
}
