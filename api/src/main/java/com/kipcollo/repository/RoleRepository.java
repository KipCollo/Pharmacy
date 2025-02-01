package com.kipcollo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kipcollo.model.Roles;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Integer>{

   Optional<Roles> findByName(String role);
}
