package com.kipcollo.prescriptions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository repository;

    public Prescriptions uploadPrescriptions(String email, MultipartFile file) {

        String imageUrl = "uploads/" + file.getOriginalFilename();
        Prescriptions prescriptions = new Prescriptions();
        prescriptions.setEmail(email);
        prescriptions.setImageURL(imageUrl);
        prescriptions.setStatus(PrescriptionStatus.PENDING);

        return repository.save(prescriptions);
    }

    public Prescriptions approvePrescriptions(Integer id) {
        Optional<Prescriptions> prescriptions = repository.findById(id);
        if (prescriptions.isEmpty()){
            throw new RuntimeException("Prescription not found");
        }

        Prescriptions prescription = prescriptions.get();
        prescription.setStatus(PrescriptionStatus.APPROVED);
        return repository.save(prescription);

    }

    public List<PrescriptionResponse> getAllPrescriptions() {
        //TODO
        return null;
    }
}
