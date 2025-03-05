package com.kipcollo.auth;

import java.time.LocalDateTime;
import java.util.List;

import com.kipcollo.customer.Customer;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@EntityListeners(AuditingEntityListener.class)

@Entity
@Table(name = "roles")
public class Roles {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int roleId;
   @Column(unique = true)
   private String name;
   @ManyToMany(mappedBy = "roles")
   @JsonIgnore
   private List<Customer> customers;
   @Column(updatable = false,nullable = false)
   @CreatedDate
   private LocalDateTime createdDate;
   @LastModifiedDate
   @Column(insertable = false)
   private LocalDateTime lastModifiedDate;

}
