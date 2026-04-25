package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.StudentAddRequest;
import com.checkmate.team1.dto.StudentAddResponse;
import com.checkmate.team1.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.checkmate.team1.dto.AdminDashboardResponse;
import com.checkmate.team1.service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import com.checkmate.team1.dto.AdminClassAttendanceResponse;
import com.checkmate.team1.service.AdminClassService;
import com.checkmate.team1.dto.AdminRecentLeaveResponse;
import com.checkmate.team1.service.AdminLeaveRequestService;
import com.checkmate.team1.dto.AdminStudentListResponse;
import com.checkmate.team1.service.AdminStudentService;
import com.checkmate.team1.dto.AdminStudentDetailResponse;
import org.springframework.web.bind.annotation.PathVariable;
import com.checkmate.team1.dto.UpdateStudentRequest;
import com.checkmate.team1.dto.UpdateStudentResponse;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.checkmate.team1.dto.DeleteStudentResponse;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;
import com.checkmate.team1.dto.AdminAttendanceListResponse;
import com.checkmate.team1.service.AdminAttendanceService;
import com.checkmate.team1.dto.AdminClassListResponse;

import java.time.LocalDate;

@Tag(name = "Admin", description = "관리자 기능 API")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StudentService studentService;
    private final AdminDashboardService adminDashboardService;
    private final AdminClassService adminClassService;
    private final AdminLeaveRequestService adminLeaveRequestService;
    private final AdminStudentService adminStudentService;
    private final AdminAttendanceService adminAttendanceService;

    @Operation(summary = "학생 등록", description = "관리자가 신규 학생을 등록합니다.")
    @PostMapping("/addStudent")
    public ApiResponse<StudentAddResponse> addStudent(
            @RequestBody StudentAddRequest request
    ) {

        StudentAddResponse response =
                studentService.addStudent(request);

        return ApiResponse.success("학생 등록 성공", response);
    }

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard() {

        AdminDashboardResponse response =
                adminDashboardService.getDashboard();

        return ApiResponse.success("관리자 대시보드 조회 성공", response);
    }

    @GetMapping("/classes/attendance")
    public ApiResponse<List<AdminClassAttendanceResponse>> getClassAttendances() {

        List<AdminClassAttendanceResponse> response =
                adminClassService.getClassAttendances();

        return ApiResponse.success("강의별 출결 현황 조회 성공", response);
    }

    @GetMapping("/leave-requests/recent")
    public ApiResponse<List<AdminRecentLeaveResponse>> getRecentLeaveRequests() {

        List<AdminRecentLeaveResponse> response =
                adminLeaveRequestService.getRecentLeaveRequests();

        return ApiResponse.success("최근 휴가 신청 내역 조회 성공", response);
    }

    @GetMapping("/students")
    public ApiResponse<AdminStudentListResponse> getStudents(
            @RequestParam(required = false) Integer classId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String statusCode,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        AdminStudentListResponse response =
                adminStudentService.getStudents(
                        classId,
                        keyword,
                        statusCode,
                        page,
                        size
                );

        return ApiResponse.success("학생 목록 조회 성공", response);
    }

    @GetMapping("/students/{studentId}")
    public ApiResponse<AdminStudentDetailResponse> getStudentDetail(
            @PathVariable String studentId
    ) {

        AdminStudentDetailResponse response =
                adminStudentService.getStudentDetail(studentId);

        if (response == null) {
            return ApiResponse.success("학생 정보를 찾을 수 없습니다.", null);
        }

        return ApiResponse.success("학생 상세 조회 성공", response);
    }

    @PutMapping("/students/{studentId}")
    public ApiResponse<UpdateStudentResponse> updateStudent(
            @PathVariable String studentId,
            @RequestBody UpdateStudentRequest request
    ) {

        UpdateStudentResponse response =
                adminStudentService.updateStudent(studentId, request);

        return ApiResponse.success(response.getMessage(), response);
    }

    @DeleteMapping("/students/{studentId}")
    public ApiResponse<DeleteStudentResponse> deleteStudent(
            @PathVariable String studentId
    ) {

        DeleteStudentResponse response =
                adminStudentService.deleteStudent(studentId);

        return ApiResponse.success(response.getMessage(), response);
    }

    @GetMapping("/attendances")
    public ApiResponse<AdminAttendanceListResponse> getAttendances(
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) Integer classId,
            @RequestParam(required = false) String attendanceStatus,
            @RequestParam(required = false) LocalDate attendanceDate,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        AdminAttendanceListResponse response =
                adminAttendanceService.getAttendances(
                        studentId,
                        classId,
                        attendanceStatus,
                        attendanceDate,
                        startDate,
                        endDate,
                        page,
                        size
                );

        return ApiResponse.success("출결 목록 조회 성공", response);
    }

    @GetMapping("/classes")
    public ApiResponse<AdminClassListResponse> getClasses(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        AdminClassListResponse response =
                adminClassService.getClasses(
                        keyword,
                        page,
                        size
                );

        return ApiResponse.success("강의 목록 조회 성공", response);
    }
}