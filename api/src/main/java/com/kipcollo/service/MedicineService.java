package com.kipcollo.service;

import com.kipcollo.dto.MedicineRequest;
import com.kipcollo.dto.MedicineResponse;
import com.kipcollo.model.Medicine;
import com.kipcollo.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

   private final MedicineRepository repository;
   private final MedicineMapper mapper;
   private FileStorageService fileStorageService;

   public PageResponse<MedicineResponse> getAllMedicine(int page,int size ) {
       Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
       Page<Medicine> medicines = repository.findAllDisplayableMedicine(pageable);
       List<MedicineResponse> medicineResponses = medicines.stream()
               .map(mapper::fromMedicine)
               .collect(Collectors.toList());

       return new PageResponse<>(
               medicineResponses,
               medicines.getNumber(),
               medicines.getSize(),
               medicines.getTotalElements()
               ,medicines.getTotalPages(),
               medicines.isFirst(),
               medicines.isLast());
   }

   public MedicineResponse getMedicineById(Integer medicineId) {
       return repository.findById(medicineId)
               .map(mapper::fromMedicine)
               .orElseThrow();
   }

   public String createMedicine(MedicineRequest request) {
       var medicine = repository.save(mapper.toMedicine(request));
       return "Medicine added with ID:: " + medicine.getMedicineId();
   }

   public void deleteMedicine(Integer medicineId) {
       repository.deleteById(medicineId);
   }
}
