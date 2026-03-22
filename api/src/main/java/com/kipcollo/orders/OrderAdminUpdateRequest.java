package com.kipcollo.orders;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderAdminUpdateRequest {
    private OrderAdminAction action;
    private String origin;
    private String destination;
    private String carrier;
    private String service;
    private String expectedArrival;
    private String shippingDate;
    private String departureTime;
    private String totalTime;
    private Double originLat;
    private Double originLng;
    private Double destinationLat;
    private Double destinationLng;
    private Boolean notifyCustomer;
}
