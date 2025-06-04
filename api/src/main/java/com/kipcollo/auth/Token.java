package com.kipcollo.auth;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kipcollo.customer.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "tokens")
public class Token {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int tokenId;
   private String token;
   private LocalDateTime createdAt;
   private LocalDateTime expiresAt;
   private LocalDateTime validatedAt;
   @ManyToOne
   @JoinColumn(name = "customerId", nullable = false)
   @JsonBackReference
   private Users users;
}
