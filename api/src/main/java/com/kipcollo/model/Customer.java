package com.kipcollo.model;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EntityListeners(AuditingEntityListener.class)
@Validated

@Entity
@Table(name="user")
public class Customer implements UserDetails, Principal{

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int customerId;
   private String firstName;
   private String lastName;
   private int age;
   private String password;
   private LocalDate dateOfBirthDate;
   private String phone;
   @Column(unique = true)
   private String email;
   private String location;
   private boolean accountLocked;
   private boolean enabled;
   @Column(updatable = false,nullable = false)
   @CreatedDate
   private LocalDateTime createdDate;
   @LastModifiedDate
   @Column(insertable = false)
   private LocalDateTime lastModifiedDate;
   @ManyToMany(fetch = FetchType.EAGER)
   private List<Roles> roles;

   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      return null;
   }
   @Override
   public String getPassword() {
      return password;
   }
   @Override
   public String getUsername() {
      return email;
   }
   @Override
   public String getName() {
      return email;
   }

   public String fullname(){
      return firstName + " " + lastName;
   }
}
