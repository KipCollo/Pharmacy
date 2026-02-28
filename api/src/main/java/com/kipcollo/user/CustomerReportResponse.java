package com.kipcollo.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CustomerReportResponse {
    private String date; // For week/day: yyyy-MM-dd, for year/month: yyyy-M
    private int customers;
}
