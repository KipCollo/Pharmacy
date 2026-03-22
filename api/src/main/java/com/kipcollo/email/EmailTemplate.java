package com.kipcollo.email;

import lombok.Getter;

@Getter

public enum EmailTemplate {

    ACTIVATE_ACCOUNT("activate_account"),
    ORDER_PLACED("order_placed"),
    ORDER_TRACKING("order_tracking");

    private final String name;

    EmailTemplate(String name) {
        this.name = name;
    }
}
