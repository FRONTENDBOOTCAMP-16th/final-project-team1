package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class CheckInResponse {

    private LocalDate attendanceDate;
    private LocalDateTime checkInTime;
    private String message;
}