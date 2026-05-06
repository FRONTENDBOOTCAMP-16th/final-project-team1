package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AdminClassDetailResponse {

    private Integer classId;
    private String className;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCompleted;
    private String completedStatusName;
    private String message;
}