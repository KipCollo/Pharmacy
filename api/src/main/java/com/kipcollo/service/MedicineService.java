//package com.kipcollo.service;
//
//import com.kipcollo.dto.MedicineRequest;
//import com.kipcollo.dto.MedicineResponse;
//import com.kipcollo.repository.MedicineRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class MedicineService {
//
//    private final MedicineRepository repository;
//    private final MedicineMapper mapper;
//
//    public List<MedicineResponse> getAllMedicine() {
//        return repository.findAll()
//                .stream()
//                .map(mapper::fromMedicine)
//                .collect(Collectors.toList());
//    }
//
//    public MedicineResponse getMedicineById(Integer medicineId) {
//        return repository.findById(medicineId)
//                .map(mapper::fromMedicine)
//                .orElseThrow();
//    }
//
//    public String createMedicine(MedicineRequest request) {
//        var medicine = repository.save(mapper.toMedicine(request));
//        return "Medicine added with ID:: " + medicine.getMedicineId();
//    }
//
//    public void deleteMedicine(Integer medicineId) {
//        repository.deleteById(medicineId);
//    }
//}
