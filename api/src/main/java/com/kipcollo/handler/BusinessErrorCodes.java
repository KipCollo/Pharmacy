package com.kipcollo.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum BusinessErrorCodes {
    No_CODE(0,NOT_IMPLEMENTED,"No CODE"),
    INCORRECT_CURRENT_PASSWORD(300,BAD_REQUEST,"Incorrect password"),
    NEW_PASSWORD_DOES_NOT_MATCH(301,BAD_REQUEST,"Password does not match"),
    ACCOUNT_DISABLED(302,FORBIDDEN,"Account disabled"),
    ACCOUNT_LOCKED(302,FORBIDDEN, "User Account is locked"),
    BAD_CREDENTIALS(304,FORBIDDEN,"Login/password incorrect");
    private final int code;
    private final String description;
    private final HttpStatus httpStatus;

    BusinessErrorCodes(int code,  HttpStatus httpStatus,String description) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
