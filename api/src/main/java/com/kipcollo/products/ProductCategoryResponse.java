package com.kipcollo.products;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategoryResponse {

    private Integer id;
    private String name;
    private String description;
    private byte[] image;
    private List<ProductResponse> products;
}
