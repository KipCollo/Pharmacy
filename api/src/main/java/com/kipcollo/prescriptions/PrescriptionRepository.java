package com.kipcollo.prescriptions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescriptions,Integer> {

    List<Prescriptions> findByUserCustomerId(Integer userId);
    Optional<Prescriptions> findTopByUserCustomerIdAndStatusOrderByUploadedAtDesc(
            Integer userId,
            PrescriptionStatus status
    );


}
