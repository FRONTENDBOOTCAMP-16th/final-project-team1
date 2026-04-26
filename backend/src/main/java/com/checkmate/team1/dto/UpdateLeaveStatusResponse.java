package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateLeaveStatusResponse {

    private Integer leaveRequestId;
    private String studentId;
    private String studentName;
    private String approvalStatusCode;
    private String approvalStatusName;
    private String message;
}