package com.kipcollo.shipments;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {

    private String id;
    private int progressStep;
    private ShipmentStatus status;
    private String expectedArrival;
    private String orderRef;
    private String carrier;
    private String service;
    private String shippingDate;
    private String origin;
    private String destination;
    private Double originLat;
    private Double originLng;
    private Double destinationLat;
    private Double destinationLng;
    private String totalTime;
    private String departureTime;
    private List<ShipmentTimelineResponse> timeline;
}
