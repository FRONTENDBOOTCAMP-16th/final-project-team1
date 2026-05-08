package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.CheckInRequest;
import com.checkmate.team1.dto.CheckInResponse;
import com.checkmate.team1.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.checkmate.team1.dto.CheckOutResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;

@Tag(name = "Attendance", description = "출결 API")
@RestController
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/api/student/attendance/check-in")
    public ApiResponse<CheckInResponse> checkIn(
            Authentication authentication
    ) {
        String studentId = authentication.getName();

        CheckInResponse response =
                attendanceService.checkIn(studentId);

        return ApiResponse.success("입실 처리 완료", response);
    }

    @PostMapping("/api/student/attendance/check-out")
    public ApiResponse<CheckOutResponse> checkOut(
            Authentication authentication
    ) {
        String studentId = authentication.getName();

        CheckOutResponse response =
                attendanceService.checkOut(studentId);

        return ApiResponse.success(response.getMessage(), response);
    }
}