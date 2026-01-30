package com.kipcollo.user;

import org.springframework.stereotype.Service;

@Service
public class UsersMapper {

   public Users toCustomer(UserRequest request) {
       return Users.builder()
               .customerId(request.getCustomerId())
               .firstName(request.getFirstName())
               .lastName(request.getLastName())
               .dateOfBirthDate(request.getDateOfBirth())
               .phone(request.getPhone())
               .email(request.getEmail())
               .location(request.getLocation())
               .build();
   }

    public UserResponse fromCustomer(Users users) {
        return new UserResponse(
                users.getCustomerId(),
                users.getFirstName(),
                users.getLastName(),
                users.getDateOfBirthDate(),
                users.getPhone(),
                users.getEmail(),
                users.getPassword(),
                users.getLocation(),
                users.getRoles(),
                users.getCreatedDate(),
                users.getLastModifiedDate()

        );
    }
}
