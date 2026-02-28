package com.kipcollo.products;

import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class HealthConditionResponse {
    private Integer id;
    private String name;
    private String description;
    private Set<Product> products;
}
