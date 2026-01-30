package com.kipcollo.prescriptions;

import com.kipcollo.user.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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
    private String email;
    private String imageURL;
    private PrescriptionStatus status;
    @ManyToOne
    private Users user;
    private LocalDate dateIssued;

}
