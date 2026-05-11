package com.checkmate.team1.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminResetPasswordRequest {
    private String currentPassword;
    private String newPassword;
}