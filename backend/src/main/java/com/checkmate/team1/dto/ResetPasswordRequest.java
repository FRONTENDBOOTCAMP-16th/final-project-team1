package com.checkmate.team1.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResetPasswordRequest {

    private String studentId;
    private String newPassword;
}