//package com.kipcollo.configs;
//
//import jakarta.transaction.Transactional;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import com.kipcollo.repository.CustomerRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class UserDetailsServiceImpl implements UserDetailsService{
//
//   private final CustomerRepository repository;
//
//   @Override
//   @Transactional
//   public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
//      return repository.findByEmail(userEmail)
//               .orElseThrow(()-> new UsernameNotFoundException("User not found!"));
//   }
//
//}
