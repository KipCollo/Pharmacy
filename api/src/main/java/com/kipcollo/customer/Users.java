package com.kipcollo.customer;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.kipcollo.auth.Roles;
import com.kipcollo.auth.Token;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
@Table(name="users")
public class Users implements Principal,UserDetails{

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int customerId;
   private String firstName;
   private String lastName;
   private LocalDate dateOfBirthDate;
   @Column(unique = true)
   private String email;
   private String password;
   private String phone;
   private String location;
   private boolean accountLocked;
   private boolean enabled;
   @OneToMany(mappedBy = "users",cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Token> tokens;
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
     return this.roles.stream()
             .map(r -> new SimpleGrantedAuthority(r.getName()))
             .collect(Collectors.toList());
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
