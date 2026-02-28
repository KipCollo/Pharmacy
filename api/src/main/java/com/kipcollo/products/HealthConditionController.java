package com.kipcollo.products;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/condition")
@RequiredArgsConstructor
public class HealthConditionController {

    private final HealthConditionService healthConditionService;

    @GetMapping
    public ResponseEntity<Set<HealthConditionResponse>> getAllConditions(){
        return ResponseEntity.ok(healthConditionService.getAllConditions());
    }

    @PostMapping
    public ResponseEntity<String> createCondition(@RequestBody HealthConditionRequest request){
        return ResponseEntity.ok(healthConditionService.createCondition(request));
    }
}
