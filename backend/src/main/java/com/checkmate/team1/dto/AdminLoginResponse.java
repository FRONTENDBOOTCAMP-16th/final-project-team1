package com.checkmate.team1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminLoginResponse {

    private String adminId;
    private String name;
    private String role;
    private String accessToken;
}