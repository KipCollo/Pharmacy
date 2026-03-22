package com.kipcollo.orders;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class RevenueReportResponse {
    private String date;
    private BigDecimal revenue;
}