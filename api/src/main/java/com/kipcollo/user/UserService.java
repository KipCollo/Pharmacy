package com.kipcollo.user;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService{

   private final UsersRepository repo;
   private final UsersMapper mapper;

   @Override
   @Transactional
   public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
       return repo.findByEmail(userEmail)
               .orElseThrow(()-> new UsernameNotFoundException("User not found!"));
   }

   public List<UserResponse> getAllCustomers() {

      return repo.findAll()
              .stream()
              .map(mapper::fromCustomer)
              .collect(Collectors.toList());
   }

    public String createCustomer(UserRequest request) {
      repo.save(mapper.toCustomer(request));
      return "Customer Created with ID:: ";
    }

   public UserResponse getCustomerById(Integer customerId) {
      return repo.findById(customerId)
              .map(mapper::fromCustomer)
              .orElseThrow(() -> new RuntimeException("Customer not found"));
   }

   public void updateCustomer(UserRequest request) {
       var customer = repo.findById(request.getCustomerId())
                       .orElseThrow(() -> new RuntimeException("Customer not found"));
       mergeCustomer(customer,request);
   }

   public void deleteCustomer(Integer customerId) {
      repo.deleteById(customerId);
   }

   private void mergeCustomer(Users users, UserRequest request) {

       if (StringUtils.isNotBlank(String.valueOf(users.getCustomerId()))){
           users.setCustomerId(request.getCustomerId());
       }
       if (StringUtils.isNotBlank(users.getFirstName())){
           users.setFirstName(request.getFirstName());
       }
       if (StringUtils.isNotBlank(users.getLastName())){
           users.setLastName(request.getLastName());
       }
       if (StringUtils.isNotBlank(String.valueOf(users.getDateOfBirthDate()))){
           users.setDateOfBirthDate(request.getDateOfBirth());
       }
       if (StringUtils.isNotBlank(users.getEmail())){
           users.setEmail(request.getEmail());
       }
       if (StringUtils.isNotBlank(users.getPhone())){
           users.setPhone(request.getPhone());
       }
       if(StringUtils.isNotBlank(users.getLocation())){
           users.setLocation(request.getLocation());
       }
       if (StringUtils.isNotBlank(users.getPassword())){
           users.setPassword(request.getPassword());
       }
   }

    public Boolean existsById(int customerId) {
       return repo.findById(customerId)
               .isPresent();
    }

    public UserResponse getCustomerByEmail(String email) {
       return repo.findByEmail(email)
               .map(mapper::fromCustomer)
               .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    // public List<UserReport> getCustomerReport(LocalDateTime startDate, LocalDateTime endDate) {
    //     if (startDate == null || endDate == null) {
    //         return repo.findAllCustomers();
    //     }
    //     return repo.findCustomersBetweenDates(startDate, endDate);
    // }

    public Users getAuthenticatedUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated request");
        }

        Object principal = authentication.getPrincipal();

        String username;

        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = principal.toString();
        }

        return repo.findByEmail(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + username)
                );
    }


    public CustomerDashboardResponse getCustomerDashboardMetrics() {
        List<Users> allUsers = repo.findAll();

        long totalCustomers = allUsers.size();
        long activeCustomers = allUsers.stream().filter(u -> !u.getCart().isEmpty()).count();
        long inactiveCustomers = totalCustomers - activeCustomers;

        LocalDateTime today = LocalDateTime.now();
        LocalDateTime startDate = today.minusDays(7); // 7-day trend
        List<DailyNewCustomer> trend = repo.findAllByCreatedDateBetween(startDate, today)
                .stream()
                .collect(Collectors.groupingBy(Users::getCreatedDate, Collectors.counting()))
                .entrySet()
                .stream()
                .map(e -> new DailyNewCustomer(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(DailyNewCustomer::getDate))
                .toList();

        return new CustomerDashboardResponse(totalCustomers, activeCustomers, inactiveCustomers, trend);
    }

}
