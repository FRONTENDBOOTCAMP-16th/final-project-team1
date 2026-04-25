package com.checkmate.team1.dto;

import lombok.Getter;

@Getter
public class UpdateStudentRequest {

    private String name;
    private String phoneNumber;
    private String email;
    private Integer classId;
    private String studentStatusCode;
}