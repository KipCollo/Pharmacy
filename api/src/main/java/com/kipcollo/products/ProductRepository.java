package com.kipcollo.products;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Product, Integer> {

    @Query("""
            SELECT product
            FROM Product product
            """)
    Page<Product> findAllDisplayableMedicine(Pageable pageable);
}
