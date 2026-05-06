package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteStudentResponse {

    private String studentId;
    private String message;
}