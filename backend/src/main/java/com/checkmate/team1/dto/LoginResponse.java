package com.checkmate.team1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String studentId;
    private String name;
    private String role;
    private Boolean isPasswordChangeRequired;
    private String accessToken;
}