package com.checkmate.team1.service;

import com.checkmate.team1.dto.StudentLeaveRequestListResponse;
import com.checkmate.team1.entity.LeaveRequest;
import com.checkmate.team1.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.CreateLeaveRequest;
import com.checkmate.team1.dto.CreateLeaveResponse;

@Service
@RequiredArgsConstructor
public class StudentLeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public StudentLeaveRequestListResponse getLeaveRequests(
            String studentId,
            int page,
            int size,
            String statusCode
    ) {

        int pageIndex = page - 1;

        PageRequest pageRequest = PageRequest.of(pageIndex, size);

        Page<LeaveRequest> leaveRequestPage;

        if (statusCode == null || statusCode.isBlank()) {
            leaveRequestPage = leaveRequestRepository.findByStudentId(
                    studentId,
                    pageRequest
            );
        } else {
            leaveRequestPage = leaveRequestRepository.findByStudentIdAndApprovalStatusCode(
                    studentId,
                    statusCode,
                    pageRequest
            );
        }

        return StudentLeaveRequestListResponse.from(
                leaveRequestPage,
                page,
                size
        );
    }

    public CreateLeaveResponse createLeaveRequest(
            String studentId,
            CreateLeaveRequest request
    ) {
        boolean exists =
                leaveRequestRepository.existsByStudentIdAndStartDateAndEndDate(
                        studentId,
                        request.getStartDate(),
                        request.getEndDate()
                );

        if (exists) {
            return CreateLeaveResponse.builder()
                    .leaveRequestId(null)
                    .message("이미 동일한 기간의 휴가가 신청되어 있습니다.")
                    .build();
        }

        LeaveRequest leaveRequest = new LeaveRequest(
                studentId,
                request.getLeaveTypeCode(),
                request.getStartDate(),
                request.getEndDate(),
                "V001"
        );

        LeaveRequest saved =
                leaveRequestRepository.save(leaveRequest);

        return CreateLeaveResponse.builder()
                .leaveRequestId(saved.getLeaveRequestId())
                .message("휴가 신청이 등록되었습니다.")
                .build();
    }
}