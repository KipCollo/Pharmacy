package com.kipcollo.prescriptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kipcollo.user.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "prescriptions")
public class Prescriptions {

    @Id
    @GeneratedValue
    private Integer id;
    @Lob
    private byte[] image;
    private PrescriptionStatus status;
    @ManyToOne
    private Users user;
    @OneToMany(mappedBy = "prescriptions",orphanRemoval = true, cascade = CascadeType.ALL)
    private List<PrescriptionItem> prescriptionItem;
    private LocalDateTime uploadedAt;

}
