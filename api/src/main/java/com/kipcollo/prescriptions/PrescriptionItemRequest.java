package com.kipcollo.prescriptions;

import com.kipcollo.products.Product;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionItemRequest {

    private Prescriptions prescriptions;
    private Product product;
    private Integer quantity;
}
