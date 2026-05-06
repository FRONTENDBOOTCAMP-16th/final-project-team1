package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteClassResponse {

    private Integer classId;
    private String message;
}