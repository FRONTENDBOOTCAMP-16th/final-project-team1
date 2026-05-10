package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.StudentDashboardResponse;
import com.checkmate.team1.dto.StudentSettingsResponse;
import com.checkmate.team1.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;

@Tag(name = "Student", description = "학생 정보 API")
@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentDashboardService studentDashboardService;

    @GetMapping("/api/student/dashboard")
    public ApiResponse<StudentDashboardResponse> getDashboard(
            Authentication authentication
    ) {
        String studentId = authentication.getName();

        StudentDashboardResponse response =
                studentDashboardService.getDashboard(studentId);

        return ApiResponse.success("학생 대시보드 조회 성공", response);
    }

    @GetMapping("/api/student/settings")
    public ApiResponse<StudentSettingsResponse> getSettings(
            Authentication authentication
    ) {
        String studentId = authentication.getName();

        StudentSettingsResponse response =
                studentDashboardService.getSettings(studentId);

        return ApiResponse.success("학생 설정 조회 성공", response);
    }
}