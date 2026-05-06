package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminRecentLeaveResponse;
import com.checkmate.team1.entity.LeaveRequest;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.LeaveRequestRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.AdminLeaveRequestListResponse;
import com.checkmate.team1.dto.UpdateLeaveStatusRequest;
import com.checkmate.team1.dto.UpdateLeaveStatusResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    public AdminLeaveRequestListResponse getLeaveRequests(
            String studentId,
            String approvalStatusCode,
            String leaveTypeCode,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size
    ) {

        List<LeaveRequest> leaveRequests =
                leaveRequestRepository.findAllByOrderByLeaveRequestIdDesc();

        List<AdminLeaveRequestListResponse.Item> filteredItems =
                leaveRequests.stream()
                        .filter(leaveRequest ->
                                studentId == null
                                        || studentId.isBlank()
                                        || leaveRequest.getStudentId().equals(studentId)
                        )
                        .filter(leaveRequest ->
                                approvalStatusCode == null
                                        || approvalStatusCode.isBlank()
                                        || leaveRequest.getApprovalStatusCode().equals(approvalStatusCode)
                        )
                        .filter(leaveRequest ->
                                leaveTypeCode == null
                                        || leaveTypeCode.isBlank()
                                        || leaveRequest.getLeaveTypeCode().equals(leaveTypeCode)
                        )
                        .filter(leaveRequest ->
                                startDate == null
                                        || !leaveRequest.getStartDate().isBefore(startDate)
                        )
                        .filter(leaveRequest ->
                                endDate == null
                                        || !leaveRequest.getEndDate().isAfter(endDate)
                        )
                        .map(leaveRequest -> {

                            Student student = studentRepository
                                    .findById(leaveRequest.getStudentId())
                                    .orElse(null);

                            String studentName = student != null ? student.getName() : "";
                            String studentInitial = getInitial(studentName);

                            return AdminLeaveRequestListResponse.Item.builder()
                                    .leaveRequestId(leaveRequest.getLeaveRequestId())
                                    .studentId(leaveRequest.getStudentId())
                                    .studentName(studentName)
                                    .studentInitial(studentInitial)
                                    .leaveTypeCode(leaveRequest.getLeaveTypeCode())
                                    .leaveTypeName(convertLeaveTypeName(leaveRequest.getLeaveTypeCode()))
                                    .startDate(leaveRequest.getStartDate())
                                    .endDate(leaveRequest.getEndDate())
                                    .periodText(formatPeriod(
                                            leaveRequest.getStartDate(),
                                            leaveRequest.getEndDate()
                                    ))
                                    .approvalStatusCode(leaveRequest.getApprovalStatusCode())
                                    .approvalStatusName(convertApprovalStatusName(
                                            leaveRequest.getApprovalStatusCode()
                                    ))
                                    .build();
                        })
                        .toList();

        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, filteredItems.size());

        List<AdminLeaveRequestListResponse.Item> pageItems =
                startIndex >= filteredItems.size()
                        ? List.of()
                        : filteredItems.subList(startIndex, endIndex);

        AdminLeaveRequestListResponse.Summary summary =
                AdminLeaveRequestListResponse.Summary.builder()
                        .pendingCount(leaveRequestRepository.countByApprovalStatusCode("V001"))
                        .approvedCount(leaveRequestRepository.countByApprovalStatusCode("V002"))
                        .rejectedCount(leaveRequestRepository.countByApprovalStatusCode("V003"))
                        .build();

        return AdminLeaveRequestListResponse.builder()
                .summary(summary)
                .items(pageItems)
                .page(page)
                .size(size)
                .totalCount(filteredItems.size())
                .build();
    }

    private String formatPeriod(LocalDate startDate, LocalDate endDate) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

        return startDate.format(formatter) + " - " + endDate.format(formatter);
    }

    private String getInitial(String name) {

        if (name == null || name.isBlank()) {
            return "";
        }

        return name.substring(0, 1);
    }

    public UpdateLeaveStatusResponse updateLeaveStatus(
            Integer leaveRequestId,
            UpdateLeaveStatusRequest request
    ) {

        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElse(null);

        if (leaveRequest == null) {
            return UpdateLeaveStatusResponse.builder()
                    .leaveRequestId(leaveRequestId)
                    .studentId(null)
                    .studentName(null)
                    .approvalStatusCode(null)
                    .approvalStatusName(null)
                    .message("존재하지 않는 휴가 신청입니다.")
                    .build();
        }

        if (!"V001".equals(leaveRequest.getApprovalStatusCode())) {
            return UpdateLeaveStatusResponse.builder()
                    .leaveRequestId(leaveRequest.getLeaveRequestId())
                    .studentId(leaveRequest.getStudentId())
                    .studentName(getStudentName(leaveRequest.getStudentId()))
                    .approvalStatusCode(leaveRequest.getApprovalStatusCode())
                    .approvalStatusName(convertApprovalStatusName(leaveRequest.getApprovalStatusCode()))
                    .message("이미 처리된 휴가 신청입니다.")
                    .build();
        }

        String nextStatusCode = request.getApprovalStatusCode();

        if (!"V002".equals(nextStatusCode) && !"V003".equals(nextStatusCode)) {
            return UpdateLeaveStatusResponse.builder()
                    .leaveRequestId(leaveRequest.getLeaveRequestId())
                    .studentId(leaveRequest.getStudentId())
                    .studentName(getStudentName(leaveRequest.getStudentId()))
                    .approvalStatusCode(leaveRequest.getApprovalStatusCode())
                    .approvalStatusName(convertApprovalStatusName(leaveRequest.getApprovalStatusCode()))
                    .message("변경할 수 없는 처리 상태입니다.")
                    .build();
        }

        leaveRequest.updateApprovalStatusCode(nextStatusCode);

        LeaveRequest savedLeaveRequest =
                leaveRequestRepository.save(leaveRequest);

        return UpdateLeaveStatusResponse.builder()
                .leaveRequestId(savedLeaveRequest.getLeaveRequestId())
                .studentId(savedLeaveRequest.getStudentId())
                .studentName(getStudentName(savedLeaveRequest.getStudentId()))
                .approvalStatusCode(savedLeaveRequest.getApprovalStatusCode())
                .approvalStatusName(convertApprovalStatusName(savedLeaveRequest.getApprovalStatusCode()))
                .message("휴가 처리 상태 변경 완료")
                .build();
    }

    private String getStudentName(String studentId) {

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        return student != null ? student.getName() : "";
    }
}