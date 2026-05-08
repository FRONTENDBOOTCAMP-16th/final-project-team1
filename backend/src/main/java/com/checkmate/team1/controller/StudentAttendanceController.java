package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.StudentAttendanceCalendarResponse;
import com.checkmate.team1.service.StudentAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final StudentAttendanceService studentAttendanceService;

    @GetMapping("/api/student/attendance-calendar")
    public ApiResponse<StudentAttendanceCalendarResponse> getAttendanceCalendar(
            @RequestParam String studentId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        StudentAttendanceCalendarResponse response =
                studentAttendanceService.getAttendanceCalendar(studentId, year, month);

        return ApiResponse.success("학생 월별 출석 캘린더 조회 성공", response);
    }
}