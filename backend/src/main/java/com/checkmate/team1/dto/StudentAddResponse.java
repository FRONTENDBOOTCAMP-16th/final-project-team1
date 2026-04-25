package com.checkmate.team1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentCreateResponse {

    private String studentId;
    private String name;
    private String phoneNumber;
    private String email;
    private Integer classId;
    private String studentStatusCode;
}