package com.checkmate.team1.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreateLeaveRequest {
    private String leaveTypeCode;
    private LocalDate startDate;
    private LocalDate endDate;
}