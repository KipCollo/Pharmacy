package com.kipcollo.cart;

import com.kipcollo.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByUserCustomerIdAndOrderedFalse(Integer customerId);
    List<Cart> findByUserCustomerIdAndStatus(Integer customerId, CartStatus status);
    List<Cart> findByStatus(CartStatus status);
    List<Cart> findByStatusAndUpdateTimeBefore(CartStatus status, LocalDateTime time);
    Optional<Cart> findByUserAndStatus(Users user, CartStatus status);


}
