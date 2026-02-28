package com.kipcollo.user;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api/customers")
@RequiredArgsConstructor
@Tag(name = "Customers APIs")
public class UsersController {

   private final UserService service;

   @GetMapping
   public ResponseEntity<List<UserResponse>> getAllCustomers(){
      return ResponseEntity.ok(service.getAllCustomers());
   }

   // @GetMapping("/report")
   // public ResponseEntity<List<UserReport>> getAllCustomersReport(
   //         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
   //         @RequestParam(required = false ) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
   // ){
   //  List<UserReport> report = service.getCustomerReport(startDate,endDate);
   //  return ResponseEntity.ok(report);
   // }


   @GetMapping("/{customerId}")
   public ResponseEntity<UserResponse> getCustomer(@PathVariable("customerId") Integer customerId){
       return ResponseEntity.ok(service.getCustomerById(customerId));
   }

    @GetMapping("/currentCustomer")
    public ResponseEntity<UserResponse> getCurrentCustomer(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername(); // Extract email from token
        UserResponse customer = service.getCustomerByEmail(email);
        return ResponseEntity.ok(customer);
    }

   @GetMapping("exists/{customerId}")
   public ResponseEntity<Boolean> existsById(@PathVariable int customerId){
       return ResponseEntity.ok(service.existsById(customerId));
   }

    @PostMapping
    public ResponseEntity<String> addCustomer(@RequestBody @Valid UserRequest customer) {
       return ResponseEntity.ok(service.createCustomer(customer));
    }

    @PutMapping
    public ResponseEntity<Void> updateCustomer(@RequestBody @Valid UserRequest customer) {
       service.updateCustomer(customer);
       return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("customerId") Integer customerId) {
       service.deleteCustomer(customerId);
       return ResponseEntity.ok().build();
    }


    @GetMapping
    public ResponseEntity<List<CustomerReportResponse>> getCustomerReport(
            @RequestParam(defaultValue = "week") String period
    ) {
        List<UserResponse> allCustomers = service.getAllCustomers();

        LocalDate today = LocalDate.now();
        List<CustomerReportResponse> report = new ArrayList<>();

        switch (period.toLowerCase()) {
            case "week":
                LocalDate weekAgo = today.minusDays(6); // last 7 days
                for (int i = 0; i < 7; i++) {
                    LocalDate day = weekAgo.plusDays(i);
                    long count = allCustomers.stream()
                            .filter(c -> c.getCreatedDate() != null &&
                                    c.getCreatedDate().toLocalDate().isEqual(day))
                            .count();
                    report.add(new CustomerReportResponse(day.toString(), (int) count));
                }
                break;

            case "month":
                int daysInMonth = today.lengthOfMonth();
                for (int i = 1; i <= daysInMonth; i++) {
                    LocalDate day = today.withDayOfMonth(i);
                    long count = allCustomers.stream()
                            .filter(c -> c.getCreatedDate() != null &&
                                    c.getCreatedDate().toLocalDate().isEqual(day))
                            .count();
                    report.add(new CustomerReportResponse(day.toString(), (int) count));
                }
                break;

            case "year":
                for (int month = 1; month <= 12; month++) {
                    int m = month;
                    long count = allCustomers.stream()
                            .filter(c -> c.getCreatedDate() != null &&
                                    c.getCreatedDate().getMonthValue() == m &&
                                    c.getCreatedDate().getYear() == today.getYear())
                            .count();
                    report.add(new CustomerReportResponse(today.getYear() + "-" + month, (int) count));
                }
                break;

            default:
                return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(report);
    }

    @GetMapping("/dashboard/customers")
    public ResponseEntity<CustomerDashboardResponse> getCustomerDashboard() {
        CustomerDashboardResponse dto = service.getCustomerDashboardMetrics();
        return ResponseEntity.ok(dto);
    }


}
