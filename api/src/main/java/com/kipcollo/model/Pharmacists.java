package com.kipcollo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "pharmacist")
public class Pharmacists {

    @Id
    @GeneratedValue
    private Integer id;
    private String license;
    private String email;
    @OneToMany
    @JoinColumn
    private List<Orders> orders;
}
