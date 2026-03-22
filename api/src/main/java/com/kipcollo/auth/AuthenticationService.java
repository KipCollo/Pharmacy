package com.kipcollo.auth;

import com.kipcollo.configs.JwtService;
import com.kipcollo.email.EmailService;
import com.kipcollo.email.EmailTemplate;
import com.kipcollo.exceptions.BadRequestException;
import com.kipcollo.exceptions.ResourceNotFoundException;
import com.kipcollo.user.Users;
import com.kipcollo.user.UsersRepository;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // Registration
    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalArgumentException("ROLE USER was not initialised"));

        String normalizedAddress = null;
        if (Objects.nonNull(request.getAddress()) && !request.getAddress().trim().isEmpty()) {
            normalizedAddress = request.getAddress().trim();
        }

        Users user = Users
                .builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirthDate(request.getDob())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .location(normalizedAddress)
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();

        usersRepository.save(Objects.requireNonNull(user));
        sendValidationEmail(user);
    }

    private void sendValidationEmail(Users user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        // @Value("${application.security.mailing.frontend.activation-url}")
        String activationUrl = "http://localhost:4200/activate-account";
        emailService.send(
                user.getEmail(), user.fullname(), EmailTemplate.ACTIVATE_ACCOUNT, activationUrl, newToken,
                "Account Activation");

    }

    private String generateAndSaveActivationToken(Users user) {
        String generatedToken = generateAndActivateCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(60))
                .users(user)
                .build();

        tokenRepository.save(Objects.requireNonNull(token));
        return generatedToken;
    }

    private String generateAndActivateCode(int length) {
        String characters = "0123456789";
        StringBuilder activationCode = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            activationCode.append(characters.charAt(randomIndex));
        }
        return activationCode.toString();

    }

    // Authentication/Login
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        var claims = new HashMap<String, Object>();
        var user = ((Users) auth.getPrincipal());
        claims.put("fullname", user.fullname());
        var jwtToken = jwtService.generateToken(claims, user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    };

    public AuthenticationResponse refreshToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid authorization header");
        }

        final String refreshToken = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail == null) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        var user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new IllegalArgumentException("Refresh token is invalid or expired");
        }

        var claims = new HashMap<String, Object>();
        claims.put("fullname", user.fullname());
        var accessToken = jwtService.generateToken(claims, user);
        var newRefreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    // Activate Account
    public void activateAccount(String token) throws MessagingException {
        Token saveToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found"));
        if (LocalDateTime.now().isAfter(saveToken.getExpiresAt())) {
            sendValidationEmail(saveToken.getUsers());
            throw new BadRequestException("Token is expired, new token has been sent");
        }
        var user = usersRepository.findById(saveToken.getUsers().getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        user.setEnabled(true);
        usersRepository.save(user);
        saveToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(saveToken);
    }
}
