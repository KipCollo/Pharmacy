package com.kipcollo.customer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users,Integer>{
 Optional<Users> findByEmail(String email);

 @Query("SELECT new com.kipcollo.customer.UserReport(c.createdDate, COUNT(c)) " +
         "FROM Users c WHERE c.createdDate BETWEEN :startDate AND :endDate GROUP BY c.createdDate")
 List<UserReport> findCustomersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

 @Query("SELECT new com.kipcollo.customer.UserReport(c.createdDate, COUNT(c)) FROM Users c GROUP BY c.createdDate")
 List<UserReport> findAllCustomers();
}
