package com.kipcollo.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CustomerDashboardResponse {
    private long totalCustomers;
    private long activeCustomers;
    private long inactiveCustomers;
    private List<DailyNewCustomer> newCustomerTrend; // For trading line


}
