package com.kipcollo.shipments;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, String> {

    Optional<Shipment> findByShipmentIdIgnoreCase(String shipmentId);
    Optional<Shipment> findFirstByOrder_Id(Integer orderId);
}
