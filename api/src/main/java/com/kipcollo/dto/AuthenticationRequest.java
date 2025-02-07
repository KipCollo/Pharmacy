package com.kipcollo.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid Email")
    @NotEmpty(message= "Username should not be Blank")
    private String email;
    @NotBlank(message = "Password is required")
    @NotEmpty(message= "Password should not be Blank")
    @Size(min = 8,message = "Password should be 8 characters long")
    private String password;
}
