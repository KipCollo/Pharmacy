package com.kipcollo.products;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("""
            SELECT product
            FROM Product product
            """)
    Page<Product> findAllDisplayableMedicine(Pageable pageable);
    List<Product> findByIdIn(List<Integer> productIds);

    @Query("""
    SELECT p FROM Product p
    JOIN p.conditions c
    WHERE c.id = :conditionId AND p.active = true
    """)
    List<Product> findByCondition(Integer conditionId);
    List<Product> findByCategoryId(Integer categoryId);
    List<Product> findTop10ByActiveTrueOrderBySoldCountDesc();
    List<Product> findByActiveTrueAndCreatedDateAfter(LocalDateTime createdDate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id IN :ids")
    List<Product> findByIdInForUpdate(@Param("ids") List<Integer> ids);


}
