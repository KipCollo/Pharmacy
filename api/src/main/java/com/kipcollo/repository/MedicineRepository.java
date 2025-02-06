package com.kipcollo.repository;

import com.kipcollo.model.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {

    @Query("""
            SELECT medicine
            FROM Medicine medicine
            """)
    Page<Medicine> findAllDisplayableMedicine(Pageable pageable);
}
