package com.kipcollo.exceptions;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProductCategoryNotFound extends RuntimeException {
    private final String message;
}
