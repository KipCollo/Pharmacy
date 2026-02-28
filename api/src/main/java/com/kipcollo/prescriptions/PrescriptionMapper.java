package com.kipcollo.prescriptions;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PrescriptionMapper {

    public PrescriptionResponse fromPrescription(Prescriptions prescriptions){
        return PrescriptionResponse
                .builder()
                .id(prescriptions.getId())
                .prescriptionItem(prescriptions.getPrescriptionItem())
                .image(prescriptions.getImage())
                .status(prescriptions.getStatus())
                .uploadedAt(prescriptions.getUploadedAt())
                .build();
    }

    public Prescriptions toPrescription(MultipartFile image) throws IOException {
        return Prescriptions
                .builder()
                .image(image.getBytes())
                .build();
    }
}
