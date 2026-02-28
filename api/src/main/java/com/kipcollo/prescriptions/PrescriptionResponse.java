package com.kipcollo.prescriptions;

import com.kipcollo.user.Users;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionResponse {

    private Integer id;
    private byte[] image;
    private PrescriptionStatus status;
    private Users user;
    private List<PrescriptionItem> prescriptionItem;
    private LocalDateTime uploadedAt;
}
