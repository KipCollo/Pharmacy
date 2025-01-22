package com.kipcollo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kipcollo.model.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token,Integer>{
 Optional<Token> findByToken(String token);
}
