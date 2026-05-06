package com.checkmate.team1.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StudentAddRequest {

    private String studentId;
    private String name;
    private String password;
    private String phoneNumber;
    private String email;
    private Integer classId;
    private String studentStatusCode;
}