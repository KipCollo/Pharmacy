package com.kipcollo.customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users,Integer>{
 Optional<Users> findByEmail(String email);
 Integer countByEmail(String email);
}
