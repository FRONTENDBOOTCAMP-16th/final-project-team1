package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminRecentLeaveResponse;
import com.checkmate.team1.entity.LeaveRequest;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.LeaveRequestRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final StudentRepository studentRepository;

    public List<AdminRecentLeaveResponse> getRecentLeaveRequests() {

        List<LeaveRequest> leaveRequests =
                leaveRequestRepository.findTop6ByOrderByLeaveRequestIdDesc();

        return leaveRequests.stream()
                .map(leaveRequest -> {
                    Student student = studentRepository
                            .findById(leaveRequest.getStudentId())
                            .orElse(null);

                    String studentName = student != null ? student.getName() : "";
                    String studentInitial = studentName.isBlank()
                            ? ""
                            : studentName.substring(0, 1);

                    return AdminRecentLeaveResponse.builder()
                            .leaveRequestId(leaveRequest.getLeaveRequestId())
                            .studentInitial(studentInitial)
                            .studentName(studentName)
                            .studentId(leaveRequest.getStudentId())
                            .leaveTypeCode(leaveRequest.getLeaveTypeCode())
                            .leaveTypeName(convertLeaveTypeName(leaveRequest.getLeaveTypeCode()))
                            .startDate(leaveRequest.getStartDate())
                            .endDate(leaveRequest.getEndDate())
                            .approvalStatusCode(leaveRequest.getApprovalStatusCode())
                            .approvalStatusName(convertApprovalStatusName(leaveRequest.getApprovalStatusCode()))
                            .build();
                })
                .toList();
    }

    private String convertLeaveTypeName(String code) {

        if ("H001".equals(code)) return "개인사유";
        if ("H002".equals(code)) return "병결";
        if ("H003".equals(code)) return "공결";

        return "";
    }

    private String convertApprovalStatusName(String code) {

        if ("V001".equals(code)) return "승인 대기";
        if ("V002".equals(code)) return "승인 완료";
        if ("V003".equals(code)) return "반려";

        return "";
    }
}