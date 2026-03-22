package com.kipcollo.prescriptions;

import com.kipcollo.exceptions.BadRequestException;
import com.kipcollo.exceptions.ResourceNotFoundException;
import com.kipcollo.products.Product;
import com.kipcollo.products.ProductRepository;
import com.kipcollo.user.UserService;
import com.kipcollo.user.Users;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper prescriptionMapper;
    private final UserService userService;
    private final ProductRepository productRepository;

    public void uploadPrescriptions(MultipartFile image) throws IOException {

        Users user = userService.getAuthenticatedUser();

        Prescriptions prescriptions = prescriptionMapper.toPrescription(image);
        prescriptions.setStatus(PrescriptionStatus.PENDING);
        prescriptions.setUser(user);
        prescriptions.setUploadedAt(LocalDateTime.now());

        repository.save(prescriptions);
    }

    @Transactional
    public void reviewPrescription(Integer prescriptionId, boolean approved, List<PrescriptionItemRequest> items) {
        if (prescriptionId == null) {
            throw new IllegalArgumentException("Prescription id is required");
        }

        Prescriptions prescription = repository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        if (!approved) {
            prescription.setStatus(PrescriptionStatus.REJECTED);
            if (prescription.getPrescriptionItem() != null) {
                prescription.getPrescriptionItem().clear();
            }
            repository.save(prescription);
            return;
        }

        if (items == null || items.isEmpty()) {
            throw new BadRequestException("At least one product is required when approving a prescription");
        }

        prescription.setStatus(PrescriptionStatus.APPROVED);

        if (prescription.getPrescriptionItem() != null) {
            prescription.getPrescriptionItem().clear();
        } else {
            prescription.setPrescriptionItem(new ArrayList<>());
        }

        for (PrescriptionItemRequest itemRequest : items) {
            if (itemRequest.getProduct() == null || itemRequest.getProduct().getId() <= 0) {
                throw new BadRequestException("Each item must have a product id");
            }

            Product product = productRepository.findById(itemRequest.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            PrescriptionItem prescriptionItem = new PrescriptionItem();
            prescriptionItem.setPrescriptions(prescription);
            prescriptionItem.setProduct(product);
            prescriptionItem.setQuantity(
                    itemRequest.getQuantity() == null || itemRequest.getQuantity() < 1 ? 1 : itemRequest.getQuantity());

            prescription.getPrescriptionItem().add(prescriptionItem);
        }

        repository.save(prescription);
    }

    @Transactional
    public void approvePrescriptions(Integer prescriptionId, List<PrescriptionItemRequest> items) {
        reviewPrescription(prescriptionId, true, items);
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
                .findTopByUserCustomerIdAndStatusOrderByUploadedAtDesc(user.getCustomerId(),
                        PrescriptionStatus.APPROVED)
                .map(prescriptionMapper::fromPrescription)
                .orElse(null);

    }
}
