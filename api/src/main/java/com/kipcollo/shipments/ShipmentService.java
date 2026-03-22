package com.kipcollo.shipments;

import com.kipcollo.email.EmailService;
import com.kipcollo.email.EmailTemplate;
import com.kipcollo.orders.Orders;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentMapper shipmentMapper;
    private final EmailService emailService;

    public List<ShipmentResponse> findAll(String search, List<ShipmentStatus> statuses, String tab) {
        String normalizedSearch = search == null ? "" : search.toLowerCase(Locale.ROOT).trim();
        List<ShipmentStatus> normalizedStatuses = statuses == null ? List.of() : statuses;
        boolean hasStatusFilter = !normalizedStatuses.isEmpty();
        String normalizedTab = tab == null ? "all" : tab.toLowerCase(Locale.ROOT).trim();

        return shipmentRepository.findAll().stream()
                .map(shipmentMapper::fromShipment)
                .filter(shipment -> {
                    if (!normalizedSearch.isEmpty()) {
                        return shipment.getId().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                                || shipment.getOrderRef().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                                || shipment.getCarrier().toLowerCase(Locale.ROOT).contains(normalizedSearch);
                    }
                    return true;
                })
                .filter(shipment -> !hasStatusFilter || normalizedStatuses.contains(shipment.getStatus()))
                .filter(shipment -> {
                    if ("arrived".equals(normalizedTab)) {
                        return shipment.getStatus() == ShipmentStatus.ARRIVED;
                    }
                    if ("pending".equals(normalizedTab)) {
                        return shipment.getStatus() != ShipmentStatus.ARRIVED;
                    }
                    return true;
                })
                .toList();
    }

    public Optional<ShipmentResponse> findById(String shipmentId) {
        return shipmentRepository.findByShipmentIdIgnoreCase(shipmentId)
                .map(shipmentMapper::fromShipment);
    }

    public boolean sendTrackingUpdateEmail(String shipmentId) {
        Optional<Shipment> shipmentOptional = shipmentRepository.findByShipmentIdIgnoreCase(shipmentId);
        if (shipmentOptional.isEmpty()) {
            return false;
        }

        Shipment shipment = shipmentOptional.get();
        Orders order = shipment.getOrder();
        if (order == null || order.getCustomers() == null || order.getCustomers().getEmail() == null) {
            return false;
        }

        List<Map<String, String>> timeline = shipment.getTimeline().stream()
                .map(entry -> {
                    Map<String, String> timelineEntry = new HashMap<>();
                    timelineEntry.put("title", entry.getTitle());
                    timelineEntry.put("time", entry.getTime());
                    timelineEntry.put("note", entry.getNote());
                    return timelineEntry;
                })
                .toList();

        Map<String, Object> properties = new HashMap<>();
        properties.put("username", order.getCustomers().fullname());
        properties.put("orderReference", order.getReference());
        properties.put("shipmentId", shipment.getShipmentId());
        properties.put("shipmentStatus", shipment.getStatus().name());
        properties.put("carrier", shipment.getCarrier());
        properties.put("service", shipment.getService());
        properties.put("expectedArrival", shipment.getExpectedArrival());
        properties.put("origin", shipment.getOrigin());
        properties.put("destination", shipment.getDestination());
        properties.put("timeline", timeline);
        properties.put("trackingUrl", "http://localhost:4200/orders");

        try {
            emailService.send(
                    order.getCustomers().getEmail(),
                    "Shipment Update - " + shipment.getShipmentId(),
                    EmailTemplate.ORDER_TRACKING,
                    properties);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }
}
