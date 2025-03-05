package com.kipcollo.orderlines;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderLineResponse {

    private int orderLineId;
    private int quantity;
}
