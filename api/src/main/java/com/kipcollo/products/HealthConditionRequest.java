package com.kipcollo.products;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class HealthConditionRequest {

    private String name;
    private String description;
}
