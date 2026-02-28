package com.kipcollo.products;

import org.springframework.stereotype.Service;

@Service
public class HealthConditionMapper {
    public HealthConditionResponse fromHealthCondition(HealthCondition healthCondition) {
        return HealthConditionResponse.builder()
                .id(healthCondition.getId())
                .name(healthCondition.getName())
                .description(healthCondition.getDescription())
                .products(healthCondition.getProducts())
                .build();
    }

    public HealthCondition toHealthCondition(HealthConditionRequest request) {
        return HealthCondition.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }
}
