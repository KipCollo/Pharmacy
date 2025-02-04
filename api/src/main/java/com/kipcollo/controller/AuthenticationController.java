//package com.kipcollo.controller;
//
//import com.kipcollo.dto.RegistrationRequest;
//import com.kipcollo.service.AuthenticationService;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.mail.MessagingException;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@Tag(name = "Authentication")
//@RestController
//@RequestMapping("/auth")
//public class AuthenticationController {
//
//    private final AuthenticationService service;
//    public AuthenticationController(AuthenticationService service) {
//        this.service = service;
//    }
//
//    @PostMapping("/register")
//    @ResponseStatus(HttpStatus.ACCEPTED)
//    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
//        service.register(request);
//        return ResponseEntity.accepted().build();
//    }
//}
