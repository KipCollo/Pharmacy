package com.kipcollo.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class DailyNewCustomer {
    private LocalDateTime date;
    private long count;
}
