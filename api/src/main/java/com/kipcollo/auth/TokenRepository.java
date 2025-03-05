package com.kipcollo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kipcollo.auth.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token,Integer>{
 Optional<Token> findByToken(String token);
}
