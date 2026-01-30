package com.kipcollo.products;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategoryResponse {

    private Integer id;
    private String name;
    private String description;
    private byte[] image;
    private List<Product> products;
}
