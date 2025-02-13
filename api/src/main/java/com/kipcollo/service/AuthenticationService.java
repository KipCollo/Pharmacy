package com.kipcollo.service;

import com.kipcollo.configs.JwtService;
import com.kipcollo.dto.AuthenticationRequest;
import com.kipcollo.dto.AuthenticationResponse;
import com.kipcollo.dto.RegistrationRequest;
import com.kipcollo.model.Customer;
import com.kipcollo.model.Token;
import com.kipcollo.repository.CustomerRepository;
import com.kipcollo.repository.RoleRepository;
import com.kipcollo.repository.TokenRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final CustomerRepository customerRepository;
  private final TokenRepository tokenRepository;
  private final EmailService emailService;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

    public void register(RegistrationRequest request) throws MessagingException {
      var userRole = roleRepository.findByName("USER")
              .orElseThrow(()-> new IllegalArgumentException("ROLE USER was not initialised"));

       Customer user =Customer
               .builder()
               .firstName(request.getFirstName())
               .lastName(request.getLastName())
               .email(request.getEmail())
               .password(passwordEncoder.encode(request.getPassword()))
               .accountLocked(false)
               .enabled(false)
               .roles(List.of(userRole))
               .build();

       customerRepository.save(user);
       sendValidationEmail(user);
   }

   private void sendValidationEmail(Customer user) throws MessagingException {
       var newToken = generateAndSaveActivationToken(user);
       // @Value("${application.security.mailing.frontend.activation-url}")
       String activationUrl = "http://localhost:4200/activate-account";
       emailService.send(
               user.getEmail(), user.fullname(),EmailTemplate.ACTIVATE_ACCOUNT, activationUrl,newToken,"Account Activation"
       );

   }
   private String generateAndSaveActivationToken(Customer user) {
       String generatedToken =generateAndActivateCode(6);
       var token = Token.builder()
               .token(generatedToken)
               .createdAt(LocalDateTime.now())
               .expiresAt(LocalDateTime.now().plusMinutes(15))
               .customer(user)
               .build();

       tokenRepository.save(token);
       return generatedToken;
   }

   private String generateAndActivateCode(int length) {
       String characters ="0123456789";
       StringBuilder activationCode = new StringBuilder();
       SecureRandom secureRandom = new SecureRandom();
       for (int i = 0; i < length; i++) {
           int randomIndex = secureRandom.nextInt(characters.length());
           activationCode.append(characters.charAt(randomIndex));
       }
       return activationCode.toString();
       
       
   }

   public AuthenticationResponse authenticate(AuthenticationRequest request) {
       var auth = authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken(
                       request.getEmail(),
                       request.getPassword()
               )
       );

       var claims = new HashMap<String,Object>();
        var user = ((Customer)auth.getPrincipal());
        claims.put("fullname",user.fullname());
        var jwtToken = jwtService.generateToken(claims,user);
       return AuthenticationResponse.builder().token(jwtToken).build();
   };

    public void activateAccount(String token) throws MessagingException {
       Token saveToken = tokenRepository.findByToken(token).orElseThrow(()-> new RuntimeException("Token not found"));
       if (LocalDateTime.now().isAfter(saveToken.getExpiresAt())){
           sendValidationEmail(saveToken.getCustomer());
           throw new RuntimeException("Token is expired,new Tokwn has been sent..");
       }
       var user = customerRepository.findById(saveToken.getCustomer().getCustomerId())
               .orElseThrow(()-> new RuntimeException("Customer not found"));
       user.setEnabled(true);
       customerRepository.save(user);
       saveToken.setValidatedAt(LocalDateTime.now());
       tokenRepository.save(saveToken);
    }
}
