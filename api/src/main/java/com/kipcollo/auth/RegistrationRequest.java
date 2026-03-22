package com.kipcollo.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegistrationRequest {

    @NotNull(message = "First Name is required")
    @NotBlank(message = "First Name is required")
    private String firstName;
    @NotNull(message = "Last Name is required")
    @NotBlank(message = "Last Name is required")
    private String lastName;
    @NotNull(message = "Email is required")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid Email")
    private String email;
    @NotNull(message = "Password is required")
    @Size(min = 8, message = "Password should be 8 characters long")
    private String password;

    @JsonAlias("location")
    private String address;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @JsonAlias("dateOfBirth")
    private LocalDate dob;
}
