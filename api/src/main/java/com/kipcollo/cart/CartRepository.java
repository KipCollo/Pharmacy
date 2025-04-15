package com.kipcollo.cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByUserIdAndOrderedFalse(int userId);
    List<Cart> findByUserIdAndStatus(int userId, CartStatus status);
    List<Cart> findByStatus(CartStatus status);
    List<Cart> findByStatusAndUpdateTimeBefore(CartStatus status, LocalDateTime time);

}
