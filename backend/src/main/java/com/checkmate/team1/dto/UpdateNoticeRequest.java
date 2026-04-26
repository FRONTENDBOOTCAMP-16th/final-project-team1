package com.checkmate.team1.dto;

import lombok.Getter;

@Getter
public class UpdateNoticeRequest {

    private String title;
    private String content;
    private Boolean isOpen;
}