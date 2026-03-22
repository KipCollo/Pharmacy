package com.kipcollo.shipments;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentTimelineResponse {

    private String title;
    private String time;
    private String note;
}
