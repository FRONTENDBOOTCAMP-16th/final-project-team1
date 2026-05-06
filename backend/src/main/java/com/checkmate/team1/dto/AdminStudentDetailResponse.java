package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminStudentDetailResponse {

    private String studentId;
    private String name;
    private String phoneNumber;
    private String email;
    private Integer classId;
    private String className;
    private String statusCode;
    private String statusName;
}