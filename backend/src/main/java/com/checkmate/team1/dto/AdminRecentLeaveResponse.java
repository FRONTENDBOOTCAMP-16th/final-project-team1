package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AdminRecentLeaveResponse {

    private Integer leaveRequestId;
    private String studentInitial;
    private String studentName;
    private String studentId;
    private String leaveTypeCode;
    private String leaveTypeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String approvalStatusCode;
    private String approvalStatusName;
}