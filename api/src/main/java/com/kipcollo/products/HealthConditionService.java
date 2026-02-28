package com.kipcollo.products;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthConditionService {

    private final HealthConditionRepository healthConditionRepository;
    private final HealthConditionMapper mapper;

    public Set<HealthConditionResponse> getAllConditions() {
        return healthConditionRepository.findAll()
                .stream().map(mapper::fromHealthCondition)
                .collect(Collectors.toSet());
    }

    public String createCondition(HealthConditionRequest request) {
        var healthCondition = healthConditionRepository.save(mapper.toHealthCondition(request));
        return "Health Condition Created with ID::" + healthCondition.getId();
    }
}
