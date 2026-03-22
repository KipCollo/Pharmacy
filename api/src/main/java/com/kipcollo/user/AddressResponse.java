package com.kipcollo.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {

    private Integer id;
    private Integer customerId;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
