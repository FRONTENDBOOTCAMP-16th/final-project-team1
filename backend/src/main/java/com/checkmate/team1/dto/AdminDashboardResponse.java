package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDashboardResponse {

    private long studentCount;
    private long classCount;
    private double attendanceRate;
    private long presentCount;
    private long lateCount;
    private long absentCount;
    private long pendingLeaveCount;
}