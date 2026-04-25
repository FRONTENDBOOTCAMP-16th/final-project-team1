package com.checkmate.team1.dto;

import lombok.Getter;

@Getter
public class ChangePasswordRequest {

    private String studentId;
    private String currentPassword;
    private String newPassword;
}