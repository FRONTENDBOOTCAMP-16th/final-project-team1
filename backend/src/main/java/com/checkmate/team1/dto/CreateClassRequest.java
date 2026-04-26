package com.checkmate.team1.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreateClassRequest {

    private String className;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCompleted;
}