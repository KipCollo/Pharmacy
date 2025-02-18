package com.kipcollo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kipcollo.dto.MedicineRequest;
import com.kipcollo.dto.MedicineResponse;
import com.kipcollo.model.Medicine;
import com.kipcollo.repository.MedicineRepository;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

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

   public String createMedicine(MedicineRequest medicineRequest, MultipartFile imageFile) {
       var medicine = repository.save(mapper.toMedicine(medicineRequest));
       return "Medicine added with ID:: " + medicine.getMedicineId();
   }

   public void deleteMedicine(Integer medicineId) {
       repository.deleteById(medicineId);
   }

   public void updateMedicine(MedicineRequest request) {
           var medicine = repository.findById(request.getMedicineId())
                   .orElseThrow(() -> new RuntimeException("Medicine not found"));
           mergeMedicine(medicine,request);
       }

   private void mergeMedicine(Medicine medicine, MedicineRequest request) {

       if (StringUtils.isNotBlank(String.valueOf(medicine.getMedicineId()))){
           medicine.setMedicineId(request.getMedicineId());
       }
       if (StringUtils.isNotBlank(medicine.getName())){
           medicine.setName(medicine.getName());
       }
       if (StringUtils.isNotBlank(medicine.getDescription())){
           medicine.setDescription(request.getDescription());
       }
       if (StringUtils.isNotBlank(String.valueOf(medicine.getPrice()))){
           medicine.setPrice(request.getPrice());
       }
       if (StringUtils.isNotBlank(String.valueOf(medicine.getStockQuantity()))){
           medicine.setStockQuantity(request.getStockQuantity());
       }
       if (StringUtils.isNotBlank(String.valueOf(medicine.getType()))){
           medicine.setType(request.getType());
       }
       if (StringUtils.isNotBlank(String.valueOf(medicine.getManufacturer()))){
           medicine.setManufacturer(medicine.getManufacturer());
       }

   }
}
