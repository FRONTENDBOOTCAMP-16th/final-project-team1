package com.checkmate.team1.dto;

import com.checkmate.team1.entity.Notice;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class StudentNoticeDetailResponse {

    private Integer noticeId;
    private String title;
    private String content;
    private LocalDate createdDate;
    private String message;

    public static StudentNoticeDetailResponse from(Notice notice) {

        return StudentNoticeDetailResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdDate(notice.getCreatedDate())
                .build();
    }
}