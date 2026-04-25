package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateStudentResponse {

    private String studentId;
    private String name;
    private Integer classId;
    private String studentStatusCode;
    private String message;
}