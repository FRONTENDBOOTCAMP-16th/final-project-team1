package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.StudentNoticeDetailResponse;
import com.checkmate.team1.dto.StudentNoticeListResponse;
import com.checkmate.team1.service.StudentNoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Student Notice", description = "학생 공지사항 API")
@RestController
@RequiredArgsConstructor
public class StudentNoticeController {

    private final StudentNoticeService studentNoticeService;

    @GetMapping("/api/student/notices")
    public ApiResponse<StudentNoticeListResponse> getNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ) {
        StudentNoticeListResponse response =
                studentNoticeService.getNotices(page, size, keyword);

        return ApiResponse.success("공지사항 목록 조회 성공", response);
    }

    @GetMapping("/api/student/notices/{noticeId}")
    public ApiResponse<StudentNoticeDetailResponse> getNoticeDetail(
            @PathVariable Integer noticeId
    ) {

        StudentNoticeDetailResponse response =
                studentNoticeService.getNoticeDetail(noticeId);

        return ApiResponse.success(response.getMessage(), response);
    }
}