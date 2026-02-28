package com.kipcollo.prescriptions;

import com.kipcollo.products.Product;
import com.kipcollo.products.ProductRepository;
import com.kipcollo.user.UserService;
import com.kipcollo.user.Users;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper prescriptionMapper;
    private final UserService userService;
    private final ProductRepository productRepository;

    public void uploadPrescriptions( MultipartFile image) throws IOException {

        Users user = userService.getAuthenticatedUser();

        Prescriptions prescriptions = prescriptionMapper.toPrescription(image);
        prescriptions.setStatus(PrescriptionStatus.PENDING);
        prescriptions.setUser(user);
        prescriptions.setUploadedAt(LocalDateTime.now());

        repository.save(prescriptions);
    }

    @Transactional
    public void approvePrescriptions(Integer prescriptionId, List<PrescriptionItemRequest> items) {
        Prescriptions prescription = repository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        prescription.setStatus(PrescriptionStatus.APPROVED);

        if (items != null && !items.isEmpty()) {

            if (prescription.getPrescriptionItem() != null) {
                prescription.getPrescriptionItem().clear();
            }

            for (PrescriptionItemRequest itemRequest : items) {
                Product product = productRepository.findById(itemRequest.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                PrescriptionItem prescriptionItem = new PrescriptionItem();
                prescriptionItem.setPrescriptions(prescription);
                prescriptionItem.setProduct(product);
                prescriptionItem.setQuantity(itemRequest.getQuantity());

                prescription.getPrescriptionItem().add(prescriptionItem);
            }
        }

        repository.save(prescription);
    }

    @Transactional
    public List<PrescriptionResponse> getAllPrescriptions() {
        return repository.findAll()
                .stream()
                .map(prescriptionMapper::fromPrescription)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<PrescriptionResponse> getUserPrescriptions() {
        Users user = userService.getAuthenticatedUser();
        return repository
                .findByUserCustomerId(user.getCustomerId())
                .stream()
                .map(prescriptionMapper::fromPrescription)
                .toList();

    }

    @Transactional
    public PrescriptionResponse getLatestApprovedPrescription() {
        Users user = userService.getAuthenticatedUser();
        return repository
                .findTopByUserCustomerIdAndStatusOrderByUploadedAtDesc(user.getCustomerId(), PrescriptionStatus.APPROVED)
                .map(prescriptionMapper::fromPrescription)
                .orElse(null);

    }
}
