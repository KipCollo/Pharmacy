package com.kipcollo.orderlines;

import com.kipcollo.orders.Orders;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor

@Entity
public class OrderLine {

    @Id
    @GeneratedValue
    private int orderLineId;
    @Enumerated(EnumType.STRING)
    private OrderLineStatus status;
    @ManyToOne
    @JoinColumn
    private Orders orders;
    private int productId;
    private int quantity;
}
