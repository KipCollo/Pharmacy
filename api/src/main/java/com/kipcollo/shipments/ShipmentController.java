package com.kipcollo.shipments;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Shipment Tracking APIs")
@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<List<ShipmentResponse>> getShipments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<ShipmentStatus> statuses,
            @RequestParam(required = false) String tab
    ) {
        return ResponseEntity.ok(shipmentService.findAll(search, statuses, tab));
    }

    @GetMapping("/{shipmentId}")
    public ResponseEntity<ShipmentResponse> getShipmentById(@PathVariable String shipmentId) {
        return shipmentService.findById(shipmentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{shipmentId}/notify-tracking")
    public ResponseEntity<Void> notifyTracking(@PathVariable String shipmentId) {
        boolean sent = shipmentService.sendTrackingUpdateEmail(shipmentId);
        if (!sent) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.accepted().build();
    }
}
