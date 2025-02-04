package com.kipcollo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "prescriptions")
public class Prescriptions {

    @Id
    @GeneratedValue
    private Integer id;
    @ManyToOne
    private Customer customer;
    private LocalDate dateIssued;
    @OneToMany
    private List<PrescriptionItem> prescriptionItems;
    @ManyToOne
    @JoinColumn
    private Doctor doctor;
}
