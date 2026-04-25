package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChangePasswordResponse {

    private Boolean changed;
    private String message;
}