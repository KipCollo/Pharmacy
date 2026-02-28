package com.kipcollo.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecialOffersRepository extends JpaRepository<SpecialOffers, Integer> {
    @Query("""
    SELECT s FROM SpecialOffers s
    WHERE s.active = true AND CURRENT_DATE BETWEEN s.startDate AND s.endDate
""")
    List<SpecialOffers> findActiveOffers();

}
