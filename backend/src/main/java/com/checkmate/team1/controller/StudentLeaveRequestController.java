package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.StudentLeaveRequestListResponse;
import com.checkmate.team1.service.StudentLeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.checkmate.team1.dto.CreateLeaveRequest;
import com.checkmate.team1.dto.CreateLeaveResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Student Leave Request", description = "학생 휴가 신청 API")
@RestController
@RequiredArgsConstructor
public class StudentLeaveRequestController {

    private final StudentLeaveRequestService studentLeaveRequestService;

    @GetMapping("/api/student/leave-requests")
    public ApiResponse<StudentLeaveRequestListResponse> getLeaveRequests(
            @RequestParam String studentId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String statusCode
    ) {

        StudentLeaveRequestListResponse response =
                studentLeaveRequestService.getLeaveRequests(
                        studentId,
                        page,
                        size,
                        statusCode
                );

        return ApiResponse.success("휴가 신청 목록 조회 성공", response);
    }

    @PostMapping("/api/student/leave-requests")
    public ApiResponse<CreateLeaveResponse> createLeaveRequest(
            @RequestBody CreateLeaveRequest request
    ) {

        CreateLeaveResponse response =
                studentLeaveRequestService.createLeaveRequest(request);

        return ApiResponse.success(response.getMessage(), response);
    }
}