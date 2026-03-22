package com.kipcollo.shipments;

import com.kipcollo.orders.Orders;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "shipments", schema = "public")
public class Shipment {

    @Id
    private String shipmentId;

    private int progressStep;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private String expectedArrival;
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

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders order;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceNumber ASC")
    @Builder.Default
    private List<ShipmentTimeline> timeline = new ArrayList<>();
}
