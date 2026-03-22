package com.kipcollo.shipments;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentMapper {

    public ShipmentResponse fromShipment(Shipment shipment) {
    String orderRef = shipment.getOrder() != null ? shipment.getOrder().getReference() : null;

        return ShipmentResponse.builder()
                .id(shipment.getShipmentId())
                .progressStep(shipment.getProgressStep())
                .status(shipment.getStatus())
                .expectedArrival(shipment.getExpectedArrival())
        .orderRef(orderRef)
                .carrier(shipment.getCarrier())
                .service(shipment.getService())
                .shippingDate(shipment.getShippingDate())
                .origin(shipment.getOrigin())
                .destination(shipment.getDestination())
                .originLat(shipment.getOriginLat())
                .originLng(shipment.getOriginLng())
                .destinationLat(shipment.getDestinationLat())
                .destinationLng(shipment.getDestinationLng())
                .totalTime(shipment.getTotalTime())
                .departureTime(shipment.getDepartureTime())
                .timeline(fromTimelineList(shipment.getTimeline()))
                .build();
    }

    public ShipmentTimelineResponse fromTimeline(ShipmentTimeline timeline) {
        return ShipmentTimelineResponse.builder()
                .title(timeline.getTitle())
                .time(timeline.getTime())
                .note(timeline.getNote())
                .build();
    }

    public List<ShipmentTimelineResponse> fromTimelineList(List<ShipmentTimeline> timeline) {
        if (timeline == null) {
            return List.of();
        }
        return timeline.stream().map(this::fromTimeline).toList();
    }
}
