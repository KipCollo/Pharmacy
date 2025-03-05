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
import com.kipcollo.model.Product;
import com.kipcollo.repository.MedicineRepository;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

   private final MedicineRepository repository;
   private final MedicineMapper mapper;
   private FileStorageService fileStorageService;

   public PageResponse<MedicineResponse> getAllMedicine(int page,int size ) {
       Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
       Page<Product> medicines = repository.findAllDisplayableMedicine(pageable);
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

   private void mergeMedicine(Product product, MedicineRequest request) {

       if (StringUtils.isNotBlank(String.valueOf(product.getMedicineId()))){
           product.setMedicineId(request.getMedicineId());
       }
       if (StringUtils.isNotBlank(product.getName())){
           product.setName(product.getName());
       }
       if (StringUtils.isNotBlank(product.getDescription())){
           product.setDescription(request.getDescription());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getPrice()))){
           product.setPrice(request.getPrice());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getStockQuantity()))){
           product.setStockQuantity(request.getStockQuantity());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getType()))){
           product.setType(request.getType());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getManufacturer()))){
           product.setManufacturer(product.getManufacturer());
       }

   }
}
