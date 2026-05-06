package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteNoticeResponse {

    private Integer noticeId;
    private String message;
}