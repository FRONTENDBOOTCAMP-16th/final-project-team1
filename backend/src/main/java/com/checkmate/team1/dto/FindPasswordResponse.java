package com.checkmate.team1.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindPasswordResponse {

    private String studentId;
    private String resetToken;
}