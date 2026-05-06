package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AdminNoticeDetailResponse {

    private Integer noticeId;
    private String title;
    private String content;
    private LocalDate createdDate;
    private Boolean isOpen;
    private String openStatusName;
    private String message;
}