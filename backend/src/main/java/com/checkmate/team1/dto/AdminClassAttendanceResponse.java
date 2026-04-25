package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminClassAttendanceResponse {

    private Integer classId;
    private String className;
    private long totalCount;
    private long presentCount;
    private long lateCount;
    private long absentCount;
}