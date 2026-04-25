package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentSettingsResponse {

    private String name;
    private String phoneNumber;
    private String studentId;
    private String className;
    private String email;
}