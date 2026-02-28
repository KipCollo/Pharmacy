package com.kipcollo.prescriptions;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionRequest {

    private byte[] image;
}
