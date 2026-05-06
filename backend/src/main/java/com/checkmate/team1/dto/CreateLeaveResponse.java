package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateLeaveResponse {

    private Integer leaveRequestId;
    private String message;
}